// utils/sbRest.js
// ---------------------------------------------------------------------------
//  usage:
//     import sb from '../utils/sbRest';
//
//     // SELECT
//     const { data } = await sb.select('daily_materials', '*', 'day_no=eq.1').single();
//
//     // UPSERT (idempotent)
//     await sb.upsert('daily_progress',
//         { citizen_id: 1, day_no: 1, notes: 'ok' },
//         'citizen_id,day_no');
//
//  options:
//     select(table, columns='*', filter='', { head=false } )
//       • .single()  -> first row or null
//
// ---------------------------------------------------------------------------

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, '') + '/rest/v1';
const KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ---------- low-level ------------------------------------------------------
function xhr(method, path, body, extra = {}) {
  return new Promise((resolve, reject) => {
    try {
      const r = new XMLHttpRequest();
      r.open(method, URL + path, true);
      r.setRequestHeader('apikey', KEY);
      r.setRequestHeader('authorization', `Bearer ${KEY}`);
      Object.keys(extra).forEach(k => r.setRequestHeader(k, extra[k]));
      if (body) r.setRequestHeader('Content-Type', 'application/json');

      r.onreadystatechange = () => {
        if (r.readyState !== 4) return;
        const ok = r.status >= 200 && r.status < 300;
        const json = r.responseText ? JSON.parse(r.responseText) : null;
        ok ? resolve({ status: r.status, data: json }) 
           : reject({ status: r.status, error: json || r.statusText });
      };
      r.send(body ? JSON.stringify(body) : null);
    } catch (err) { reject(err); }
  });
}

// ---------- SELECT ---------------------------------------------------------
function select(table, columns = '*', filter = '', opts = {}) {
  const head   = opts.head ? '&head=true' : '';
  const path   = `/${table}?select=${encodeURIComponent(columns)}${filter ? `&${filter}` : ''}${head}`;
  const target = {
    then: (res, rej) => xhr('GET', path, null).then(res, rej),

    // sugar: .single()  (.maybeSingle() аналога нет — просто ловим null)
    single: () =>
      xhr('GET', path + '&limit=1', null, { Accept: 'application/vnd.pgrst.object+json' })
        .then(({ data }) => ({ data }))
  };
  return target;
}

// ---------- UPSERT ---------------------------------------------------------
function upsert(table, row, conflictKeys = '') {
  const path = `/${table}${conflictKeys ? `?on_conflict=${conflictKeys}` : ''}`;
  const headers = {
    Prefer: 'return=minimal,resolution=merge-duplicates'   // 204 No Content, idempotent
  };
  return xhr('POST', path, row, headers).then(({ status }) => status === 204);
}

// ---------- PUBLIC API -----------------------------------------------------
export default { select, upsert };
