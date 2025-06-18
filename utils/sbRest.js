// utils/sbRest.js
// ---------------------------------------------------------------------------
// Мини-клиент Supabase поверх XMLHttpRequest.
// Работает даже в Android 4.4 / iOS 9 (где нет fetch / Promise).
// ---------------------------------------------------------------------------

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '') + '/rest/v1';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* ---------- низкоуровневый вызов ---------------------------------------- */
function xhr(method, path, body, extra = {}) {
  return new Promise((resolve, reject) => {
    try {
      const r = new XMLHttpRequest();
      r.open(method, URL + path, true);

      /* базовые заголовки */
      r.setRequestHeader('apikey', KEY);
      r.setRequestHeader('authorization', `Bearer ${KEY}`);

      /* дополнительные */
      Object.keys(extra).forEach(k => r.setRequestHeader(k, extra[k]));
      if (body) r.setRequestHeader('Content-Type', 'application/json');

      r.onreadystatechange = () => {
        if (r.readyState !== 4) return;
        const ok   = r.status >= 200 && r.status < 300;
        const json = r.responseText ? JSON.parse(r.responseText) : null;
        ok ? resolve({ status: r.status, data: json })
           : reject ({ status: r.status, error: json || r.statusText });
      };

      r.send(body ? JSON.stringify(body) : null);
    } catch (err) { reject(err); }
  });
}

/* ---------- SELECT ------------------------------------------------------- */
function select(table, columns = '*', filter = '', opts = {}) {
  const head = opts.head ? '&head=true' : '';
  const path = `/${table}?select=${encodeURIComponent(columns)}${filter ? `&${filter}` : ''}${head}`;

  const api = {
    /* обычный then */
    then: (res, rej) => xhr('GET', path, null).then(res, rej),

    /* .single() – вернуть одну строку (или null) */
    single: () =>
      xhr('GET',
          path + '&limit=1',
          null,
          { Accept: 'application/vnd.pgrst.object+json' }
      ).then(({ data }) => ({ data }))
  };

  return api;
}

/* ---------- UPSERT (idempotent) ----------------------------------------- */
function upsert(table, row, conflictKeys = '') {
  const path    = `/${table}${conflictKeys ? `?on_conflict=${conflictKeys}` : ''}`;
  const headers = {
    Prefer: 'return=minimal,resolution=merge-duplicates'  // 204 No Content
  };

  return xhr('POST', path, row, headers).then(
    ({ status }) => status === 204
  );
}

/* ---------- публичный API ------------------------------------------------ */
export default { select, upsert };
