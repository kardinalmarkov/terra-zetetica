// pages/api/logout.js

import { serialize } from 'cookie';

export default function handler(req, res) {
  // удаляем куку 'tg', которую вы ставите в /api/auth
  res.setHeader('Set-Cookie', serialize('tg', '', {
    path: '/',
    expires: new Date(0),
    // secure: true, // при необходимости
    // sameSite: 'lax',
  }));
  res.status(200).json({ ok: true });
}
