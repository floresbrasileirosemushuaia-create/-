/**
 * Vercel Serverless Function
 * Caminho: /api/gas
 * CommonJS para funcionar sem package.json / type:module
 */

const WEBAPP_URL =
  process.env.WEBAPP_URL ||
  'https://script.google.com/macros/s/AKfycbyueYWKRtc8allm9E-C18gFHQSwxwEShuvBvvwMekR2tPikNL1eD8nvpfU4VpwyTIU-/exec';

module.exports = async (req, res) => {
  // CORS (liberado para qualquer origem)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      ok: false,
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    });
    return;
  }

  try {
    const upstream = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    const text = await upstream.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch (e) {
      // Apps Script não retornou JSON válido
      json = {
        ok: false,
        data: null,
        error: 'INVALID_JSON_FROM_GAS',
        raw: text
      };
    }

    // Se o GAS ainda não usar {ok,data,error}, normalizo aqui
    if (typeof json.ok !== 'boolean') {
      json = { ok: true, data: json, error: null };
    }

    res.status(upstream.status).json(json);
  } catch (e) {
    res.status(500).json({
      ok: false,
      data: null,
      error: e && e.message ? e.message : String(e || 'ERROR')
    });
  }
};
