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

import https from 'node:https';

const COOLDOWN_MS = 60_000;
const lastCallByIp = new Map();

const isValidPhone = (p) => typeof p === 'string' && /^\+[1-9]\d{6,14}$/.test(p);

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const last = lastCallByIp.get(ip);
  if (last && Date.now() - last < COOLDOWN_MS) {
    return res.status(429).json({
      error: 'rate_limited',
      retry_after: Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 1000),
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
    return res.status(500).json({ error: 'agent_not_configured' });
  }

  try {
    const { status, body } = await originateCall(apiBase, apiKey, {
      destination_number: phone,
      agent: agentId,
      customer_data: {
        nombre: (typeof name === 'string' && name.trim()) || 'Visitante',
        source: 'web-demo',
      },
    });

    if (status === 200 && body?.status === 'success') {
      lastCallByIp.set(ip, Date.now());
      return res.status(200).json({ ok: true, conversation_id: body.conversation_id });
    }
    return res.status(502).json({ error: 'upstream_failed', detail: body });
  } catch (err) {
    return res.status(502).json({ error: 'upstream_unreachable', detail: String(err) });
  }
}
