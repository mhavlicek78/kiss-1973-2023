// KISS 1973–2023: synchronizace sbírky karet podle kódu sbírky.
// Klient posílá SHA-256 otisk kódu (64 hex znaků), samotný kód sem nikdy nedorazí.
const ORIGINS = ['https://mhavlicek78.github.io', 'http://127.0.0.1:8000', 'http://localhost:8000'];
const MAX = 32 * 1024;

function merge(a, b) {
  a = a || {}; b = b || {};
  const out = {done:{...(a.done || {})}, foil:{...(a.foil || {})}, best:{...(a.best || {})}, qbest:{...(a.qbest || {})}};
  for (const key of ['sbest', 'lbest', 'mbest', 'kbest', 'ngbest', 'rbest', 'got']) {
    out[key] = {...(a[key] || {})};
    for (const k in (b[key] || {})) { const x = b[key][k]; if (typeof x === 'number' && (out[key][k] == null || x < out[key][k])) out[key][k] = x; }
  }
  for (const k in (b.qbest || {})) { const x = b.qbest[k]; if (x && typeof x.score === 'number' && (!out.qbest[k] || x.score > out.qbest[k].score)) out.qbest[k] = {score:x.score, correct:x.correct}; }
  out.rmax = Math.max(typeof a.rmax === 'number' ? a.rmax : 0, typeof b.rmax === 'number' ? b.rmax : 0);
  for (const k in (b.done || {})) if (b.done[k] === true) out.done[k] = true;
  for (const k in (b.foil || {})) if (b.foil[k] === true) out.foil[k] = true;
  for (const k in (b.best || {})) {
    const x = b.best[k], y = out.best[k];
    if (x && typeof x.moves === 'number' && (!y || x.moves < y.moves || (x.moves === y.moves && x.secs < y.secs))) out.best[k] = {moves:x.moves, secs:x.secs};
  }
  return out;
}

function cors(req) {
  const o = req.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(o) ? o : ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
const json = (req, data, status = 200) => new Response(JSON.stringify(data), {status, headers:{...cors(req), 'Content-Type':'application/json', 'Cache-Control':'no-store'}});

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, {status:204, headers:cors(req)});
    const m = new URL(req.url).pathname.match(/^\/s\/([a-f0-9]{64})$/);
    if (!m) return json(req, {ok:true, app:'kiss-sbirka'}, m === null && new URL(req.url).pathname === '/' ? 200 : 404);
    const key = 's:' + m[1];
    if (req.method === 'GET') {
      const data = await env.SBIRKA.get(key, 'json');
      return json(req, {data:data || null});
    }
    if (req.method === 'PUT') {
      const text = await req.text();
      if (text.length > MAX) return json(req, {error:'too_large'}, 413);
      let body; try { body = JSON.parse(text); } catch { return json(req, {error:'bad_json'}, 400); }
      const old = await env.SBIRKA.get(key, 'json');
      const merged = merge(merge({}, old), body);
      if (JSON.stringify(merged) !== JSON.stringify(old)) await env.SBIRKA.put(key, JSON.stringify(merged));
      return json(req, {data:merged});
    }
    return json(req, {error:'method'}, 405);
  }
};
