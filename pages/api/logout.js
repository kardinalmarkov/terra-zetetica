// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  // стираем cookie tg
  res.setHeader(
    'Set-Cookie',
    serialize('tg', '', {
      path: '/',
      maxAge: 0,          // <-- гарантированное удаление
      sameSite: 'lax',
      secure: true,       // оставьте, если у вас HTTPS
    }),
  );
  res.status(200).json({ ok: true });
}
