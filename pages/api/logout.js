// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  // удаляем куку 'user'
  res.setHeader('Set-Cookie', serialize('user', '', {
    path: '/',
    expires: new Date(0),
  }));
  res.status(200).json({ ok: true });
}
