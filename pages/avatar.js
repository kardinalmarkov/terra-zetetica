import Head from 'next/head'
import { useEffect } from 'react'

export default function Avatar() {
  useEffect(() => {
    const host = 'https://labs.heygen.com'
    const share =
      'eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJHcmFoYW1fQ2FzdWFsTG9va19wdWJsaWMiLCJwcmV2aWV3SW1nIjoiaHR0cHM6Ly9maWxlczIuaGV5Z2VuLmFpL2F2YXRhci92My85MzI3NTcwMjFjNDg0NWMzYjMxODMyZDQzM2YyZWUwOV81NTg0MC9wcmV2aWV3X3RhcmdldC53ZWJwIiwibmVlZFJlbW92ZUJhY2tncm91bmQiOmZhbHNlLCJrbm93bGVkZ2VCYXNlSWQiOiJhZmE4MzVkZTM2NjA0ODdhYWVlZmYwYjBmZDNjMWYyNyIsInVzZXJuYW1lIjoiYTM3NzZmOGFjZjM2NGI3ZThmMmUxMGUwMWU1YjY0YjQifQ=='
    const url = `${host}/guest/streaming-embed?share=${share}&inIFrame=1`
    const wrap = document.createElement('div')
    wrap.id = 'heygen-streaming-embed'
    wrap.innerHTML = `
      <style>
        #heygen-streaming-embed {
          position: fixed;
          left: 30px;
          bottom: 30px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          transition: 0.2s ease;
        }
        #heygen-streaming-embed.show {
          opacity: 1;
          visibility: visible;
        }
        #heygen-streaming-embed.expand {
          ${
            typeof window !== 'undefined' && window.innerWidth < 540
              ? 'height: 266px; width: 96%; left: 50%; transform: translateX(-50%);'
              : 'height: 366px; width: calc(366px * 16 / 9);'
          }
          border-radius: 12px;
          border: none;
        }
        #heygen-streaming-embed iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
      </style>
      <iframe
        title="Представитель Terra Zetetica"
        role="dialog"
        allow="microphone"
        src="${url}"
      ></iframe>`
    document.body.appendChild(wrap)

    const listener = e => {
      if (e.origin !== host || !e.data || e.data.type !== 'streaming-embed') return
      if (e.data.action === 'init') wrap.classList.add('show')
      else if (e.data.action === 'show') wrap.classList.add('expand')
      else if (e.data.action === 'hide') wrap.classList.remove('expand')
    }

    window.addEventListener('message', listener)
    return () => {
      window.removeEventListener('message', listener)
      wrap.remove()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Виртуальный представитель | Terra Zetetica</title>
      </Head>
      <main
        style={{
          minHeight: '100vh',
          padding: '8vh 1rem 340px',
          background: '#0e1a2b',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2.1rem', marginBottom: '1.2rem' }}>
          Виртуальный представитель Terra Zetetica
        </h1>

        <p style={{ maxWidth: 520, lineHeight: 1.6, opacity: 0.95 }}>
          Добро пожаловать! Спроси о гражданстве, анклаве, Конституции,
          экономике или&nbsp;DAO.<br />
          <strong>Совет:</strong> чтобы разговаривать голосом на русском —
          нажми <em>Chat&nbsp;now</em>, разреши микрофон и после открытия окна
          коснись аватара повторно.
        </p>

        <small style={{ marginTop: '2rem', opacity: 0.7 }}>
          Загрузка аватара... Пожалуйста, подождите несколько секунд
        </small>
      </main>
    </>
  )
}
