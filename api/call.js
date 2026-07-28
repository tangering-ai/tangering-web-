// Vercel Serverless Function — proxies the in-page "Talk to our AI" button
// to Tangering's production Voice API (Make Call).
//
// Docs: POST https://phone.tangering.ai/originate
//   Authorization: Bearer <TANGERING_API_KEY>
//
// Required env vars (set in the Vercel dashboard, server-side only):
//   TANGERING_API_KEY — Tangering platform API key (tng_...)
//   TANGERING_AGENT_ID — UUID of the voice agent that should take the call
// Optional env vars:
//   TANGERING_API_BASE — defaults to "https://phone.tangering.ai"
//   CALL_ALLOWED_ORIGINS — extra comma-separated origins (e.g. a preview domain)
//   CALL_COOLDOWN_SECRET — HMAC key for the cookie cooldown; falls back to TANGERING_API_KEY
//
// This is a public, unauthenticated endpoint that spends real telephony
// credits, so it is defended in depth:
//   1. Origin allowlist — stops other websites driving it from a browser
//   2. Signed cookie    — per-browser cooldown that survives cold starts
//   3. In-memory map    — per-IP cooldown; fast path, warm instances only
// None of these is a distributed rate limit. A serverless instance holds no
// shared state, so the authoritative brake must live at the edge: configure a
// Vercel Firewall rate-limit rule on /api/call.

import https from 'node:https';
import crypto from 'node:crypto';

const COOLDOWN_MS = 60_000;
const COOKIE_NAME = 'tg_call_ck';
const MAX_NAME_LEN = 60;
const MAX_IP_ENTRIES = 5_000;

const DEFAULT_ORIGINS = ['https://tangering.ai', 'https://www.tangering.ai'];

// Per-IP cooldown. Module scope, so it only covers requests that happen to hit
// the same warm instance — a cheap first line, never the guarantee.
const lastCallByIp = new Map();

function allowedOrigins() {
  const extra = (process.env.CALL_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_ORIGINS, ...extra]);
}

// Without this the Map grows for the lifetime of the instance.
function pruneIps(now) {
  if (lastCallByIp.size < MAX_IP_ENTRIES) return;
  for (const [ip, at] of lastCallByIp) {
    if (now - at > COOLDOWN_MS) lastCallByIp.delete(ip);
  }
}

function parseCookies(header) {
  const out = {};
  for (const part of String(header || '').split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    out[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return out;
}

function cooldownSecret() {
  return process.env.CALL_COOLDOWN_SECRET || process.env.TANGERING_API_KEY || '';
}

function sign(expiresAt, secret) {
  return crypto.createHmac('sha256', secret).update(String(expiresAt)).digest('base64url');
}

// Returns ms remaining on the cookie cooldown, or 0 if absent/invalid/expired.
function cookieCooldownRemaining(req, secret, now) {
  if (!secret) return 0;
  const raw = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!raw) return 0;

  const dot = raw.lastIndexOf('.');
  if (dot < 1) return 0;
  const expiresAt = Number(raw.slice(0, dot));
  const mac = raw.slice(dot + 1);
  if (!Number.isFinite(expiresAt) || !mac) return 0;

  const expected = sign(expiresAt, secret);
  const got = Buffer.from(mac);
  const want = Buffer.from(expected);
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return 0;

  return Math.max(0, expiresAt - now);
}

function cooldownCookie(expiresAt, secret) {
  return [
    `${COOKIE_NAME}=${expiresAt}.${sign(expiresAt, secret)}`,
    `Max-Age=${Math.ceil(COOLDOWN_MS / 1000)}`,
    'Path=/api/call',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
  ].join('; ');
}

const isValidPhone = (p) => typeof p === 'string' && /^\+[1-9]\d{6,14}$/.test(p);

// This string is handed to the voice agent as conversation context, so strip
// control characters and cap the length rather than passing it through raw.
function cleanName(raw) {
  if (typeof raw !== 'string') return '';
  return raw.replace(/\p{C}/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LEN);
}

function originateCall(apiBase, apiKey, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${apiBase}/originate`);
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 15_000,
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => {
          let parsed = {};
          try { parsed = JSON.parse(chunks); } catch { parsed = { raw: chunks }; }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('upstream_timeout')));
    req.write(body);
    req.end();
  });
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  // A missing Origin means a non-browser client, where CORS is not a control
  // anyway. The allowlist exists to stop *other sites* spending our credits.
  const originOk = !origin || allowedOrigins().has(origin);

  res.setHeader('Vary', 'Origin');
  if (origin && originOk) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!originOk) return res.status(403).json({ error: 'origin_not_allowed' });

  const now = Date.now();
  const secret = cooldownSecret();

  const cookieLeft = cookieCooldownRemaining(req, secret, now);
  if (cookieLeft > 0) {
    return res.status(429).json({
      error: 'rate_limited',
      retry_after: Math.ceil(cookieLeft / 1000),
    });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const last = lastCallByIp.get(ip);
  if (last && now - last < COOLDOWN_MS) {
    return res.status(429).json({
      error: 'rate_limited',
      retry_after: Math.ceil((COOLDOWN_MS - (now - last)) / 1000),
    });
  }

  const { phone, name } = req.body || {};
  if (!isValidPhone(phone)) {
    return res.status(400).json({ error: 'invalid_phone' });
  }

  const apiKey = process.env.TANGERING_API_KEY;
  const agentId = process.env.TANGERING_AGENT_ID;
  const apiBase = process.env.TANGERING_API_BASE || 'https://phone.tangering.ai';
  if (!apiKey || !agentId) {
    console.error('[api/call] missing TANGERING_API_KEY or TANGERING_AGENT_ID');
    return res.status(500).json({ error: 'agent_not_configured' });
  }

  // Claim the slot *before* dialing. Setting it only on success let concurrent
  // requests all pass the check and place simultaneous calls.
  pruneIps(now);
  lastCallByIp.set(ip, now);

  try {
    const { status, body } = await originateCall(apiBase, apiKey, {
      destination_number: phone,
      agent: agentId,
      customer_data: {
        nombre: cleanName(name) || 'Visitante',
        source: 'web-demo',
      },
    });

    if (status === 200 && body?.status === 'success') {
      if (secret) {
        res.setHeader('Set-Cookie', cooldownCookie(now + COOLDOWN_MS, secret));
      }
      return res.status(200).json({ ok: true, conversation_id: body.conversation_id });
    }

    // Do not echo the upstream body to the public — it can carry internal
    // error detail. Log it server-side and return an opaque error.
    lastCallByIp.delete(ip);
    console.error('[api/call] upstream_failed', { status, body });
    return res.status(502).json({ error: 'upstream_failed' });
  } catch (err) {
    lastCallByIp.delete(ip);
    console.error('[api/call] upstream_unreachable', err);
    return res.status(502).json({ error: 'upstream_unreachable' });
  }
}
