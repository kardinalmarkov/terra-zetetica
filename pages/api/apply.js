// pages/api/apply.js
import { nanoid } from 'nanoid'
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, name } = req.body
  const zid = `Z-${nanoid(6).toUpperCase()}`

  // отправка письма с подтверждением
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  await transporter.sendMail({
    from: '"Terra Zetetica" <no-reply@terra-zetetica.org>',
    to: email,
    subject: 'Подтверждение гражданства Terra Zetetica',
    text: `Привет, ${name}!\n\nВаш Z-ID: ${zid}\nСпасибо за присоединение!`
  })

  // TODO: записать email, name, zid в БД или IPFS-реестр

  res.status(200).json({ message: 'Письмо с вашим Z-ID отправлено!' })
}
