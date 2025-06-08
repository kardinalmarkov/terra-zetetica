// pages/api/logout.js
import { serialize } from 'cookie'

export default function handler (_req, res) {
  res.setHeader('Set-Cookie', [
    serialize('tg','',{path:'/',expires:new Date(0)}),
    serialize('cid','',{path:'/',expires:new Date(0)})
  ])
  res.status(200).json({ ok:true })
}
