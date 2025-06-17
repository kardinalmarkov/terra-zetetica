// utils/localAuth.js версия 1.0
// ------------------------------------------------------------
// Единая точка доступа к cid/tg (cookie + localStorage)

export const getCid = () => {
  if (typeof document === 'undefined') return '';
  // 1️⃣ Пытаемся взять из cookie
  const m = document.cookie.match(/(?:^|; )cid=(\d+)/);
  if (m) return m[1];
  // 2️⃣ fallback — localStorage
  return localStorage.getItem('cid') || '';
};

export const saveCid = (value) => {
  if (!value) return;
  // cookie на год, SameSite=None ⇒ не режется в iOS
  document.cookie =
    `cid=${value}; Path=/; SameSite=None; Secure; Max-Age=${60 * 60 * 24 * 365}`;
  localStorage.setItem('cid', value);
};

export const getTg = () => {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|; )tg=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : localStorage.getItem('tg') || '';
};

export const saveTg = (json) => {
  if (!json) return;
  const val = encodeURIComponent(json);
  document.cookie =
    `tg=${val}; Path=/; SameSite=None; Secure; Max-Age=${60 * 60 * 24 * 365}`;
  localStorage.setItem('tg', json);
};
