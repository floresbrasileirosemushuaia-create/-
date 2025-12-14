# Fix Vercel: CORS com Google Apps Script

## O erro do print
O browser bloqueia `fetch()` direto para `script.google.com` por CORS (Apps Script não envia `Access-Control-Allow-Origin`).

## Solução correta: Proxy no Vercel
1) No seu repo, crie a pasta `api/` e adicione o arquivo:
- `api/gas.js` (use o arquivo que te enviei)

2) No Vercel (Dashboard → Project → Settings → Environment Variables):
- `GAS_WEBAPP_URL` = sua URL /exec do WebApp (opcional; se não setar, usa o hardcoded do arquivo)

3) No seu `index.html`:
- Use o HTML patchado que chama **/api/gas** por padrão.
- Em GitHub Pages (se quiser usar GitHub), preencha:
  `window.API_PROXY_URL = "https://SEU-VERCEL-DOMINIO/api/gas"`

## Teste
- DevTools → Network:
  - deve existir POST para `/api/gas` (mesma origem)
  - response JSON `{ ok:true, ... }`
