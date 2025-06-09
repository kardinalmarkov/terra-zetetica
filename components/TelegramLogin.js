// components/TelegramLogin.js
// Telegram Login Widget, который действительно запускается в браузере
// (React удаляет <script> при SSR, поэтому подключаем его в useEffect).

import { useEffect, useRef } from 'react'

export default function TelegramLogin ({
  bot      = 'ZeteticID_bot',
  lang     = 'ru',
  size     = 'large',
  authUrl  = '/api/auth',
  onLoaded = ()=>{}
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    // создаём <script …> динамически
    const s = document.createElement('script')
    s.src  = 'https://telegram.org/js/telegram-widget.js?22'
    s.async = true
    s.setAttribute('data-telegram-login',  bot)
    s.setAttribute('data-size',            size)
    s.setAttribute('data-userpic',         'true')
    s.setAttribute('data-lang',            lang)
    s.setAttribute('data-request-access',  'write')
    s.setAttribute('data-auth-url',        authUrl)
    s.onload = onLoaded
    ref.current.appendChild(s)

    return () => { ref.current.innerHTML = '' }   // cleanup
  }, [])

  return <div ref={ref} />
}
