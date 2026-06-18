// Vercel Serverless Function — proxies the in-page "Talk to our AI" button
// to Tangering's make_call endpoint.
//
// Required env vars (set in the Vercel dashboard):
//   TANGERING_AGENT_NUMBER — agent phone in E.164 (e.g. "+18443310812")
// Optional env vars:
//   TANGERING_API_BASE     — defaults to "https://13.57.8.111"

import https from 'node:https';

const COOLDOWN_MS = 60_000;
const lastCallByIp = new Map();

const isValidPhone = (p) => typeof p === 'string' && /^\+[1-9]\d{6,14}$/.test(p);

function postToTangering(apiBase, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${apiBase}/api/v1/make_call`);
    const body = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        rejectUnauthorized: false, // Tangering server has a self-signed cert
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

  const agentNumber = process.env.TANGERING_AGENT_NUMBER;
  const apiBase = process.env.TANGERING_API_BASE || 'https://13.57.8.111';
  if (!agentNumber) {
    return res.status(500).json({ error: 'agent_not_configured' });
  }

  try {
    const { status, body } = await postToTangering(apiBase, {
      destination_number: phone,
      agent_id: agentNumber,
      nombre: (typeof name === 'string' && name.trim()) || 'Visitante',
    });

    if (status >= 200 && status < 300 && body?.status === 'success') {
      lastCallByIp.set(ip, Date.now());
      return res.status(200).json({ ok: true });
    }
    return res.status(502).json({ error: 'upstream_failed', detail: body });
  } catch (err) {
    return res.status(502).json({ error: 'upstream_unreachable', detail: String(err) });
  }
}
