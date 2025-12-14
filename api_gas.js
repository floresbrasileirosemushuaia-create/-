// Vercel Serverless Function: /api/gas
// Coloque este arquivo em: api/gas.js
// (Opcional) Configure a env var GAS_WEBAPP_URL no Vercel.
export default async function handler(req, res) {
  // CORS (permite chamadas do seu front)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(200).json({ ok: false, data: null, error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const GAS_WEBAPP_URL =
    process.env.GAS_WEBAPP_URL ||
    'https://script.google.com/macros/s/AKfycbzh4ieD1tp5NZsrBQE-PF-k2YJujdg0VdkB99XUHCg6qFSBejSmDPpkFWbEpRFSsTmK/exec';

  let body = req.body;

  // Compat: alguns setups enviam body como string
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }

  if (!body || !body.action) {
    res.status(200).json({ ok: false, data: null, error: 'BAD_REQUEST' });
    return;
  }

  try {
    const r = await fetch(GAS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body)
    });

    const txt = await r.text();

    // Apps Script deve responder JSON; se vier HTML, devolvemos erro com raw
    try {
      const parsed = JSON.parse(txt);
      res.status(200).json(parsed);
    } catch (e) {
      res.status(200).json({ ok: false, data: null, error: 'GAS_NON_JSON', raw: txt });
    }
  } catch (e) {
    const msg = e && e.message ? e.message : String(e || 'ERROR');
    res.status(200).json({ ok: false, data: null, error: msg });
  }
}
