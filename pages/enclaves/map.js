// pages/map.js
import Head from 'next/head'
import { useState, useRef } from 'react'
import {
  UncontrolledReactSVGPanZoom,
  InitialValue
} from 'react-svg-pan-zoom'

// ⚡️ если у вас статическая карта 1000×1000 px,
//   координаты x/y считайте именно в этой системе.
const enclaves = [
  {
    id: 'TZ-SPB-DOMISTINY',
    name: 'Дом Истины',
    coords: { x: 540, y: 470 },
    color: '#f43f5e',
    description: 'Жилой анклав в Санкт-Петербурге',
    curatorZid: 'ZID-0001',
    temp: '+17 °C'
  },
  {
    id: 'TZ-BY-BRST-ULY-002',
    name: 'Светлый Улей',
    coords: { x: 550, y: 480 },
    color: '#10b981',
    description: 'Аграрно-исследовательский дом в Брестской области',
    curatorZid: 'ZID-0002',
    temp: '+19 °C'
  }
]

export default function MapPage () {
  const Viewer = useRef(null)
  const [active, setActive] = useState(null)

  return (
    <main className='wrapper'>
      <Head><title>🧭 Карта анклавов | Terra Zetetica</title></Head>

      <h1 style={{ textAlign: 'center', margin: '1.5rem 0' }}>🧭 Карта анклавов</h1>

      <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
        <UncontrolledReactSVGPanZoom
          width={1000}
          height={600}
          ref={Viewer}
          detectAutoPan={false}
          toolbarProps={{ position: 'none' }}
          miniatureProps={{ position: 'none' }}
          background='#ffffff'
          initialValue={InitialValue.fitToViewer}
        >
          <svg width={1000} height={1000}>
            {/* сама картинка карты Глисона */}
            <image href='/images/terra-map-2d.webp'
                   x='0' y='0' width='1000' height='1000' />

            {/* точки-анклавы */}
            {enclaves.map(e => (
              <g key={e.id}
                 onClick={(evt) => {
                   // переводим координаты SVG → экран
                   const pt = evt.target.ownerSVGElement.createSVGPoint()
                   pt.x = e.coords.x; pt.y = e.coords.y
                   const { x, y } = pt.matrixTransform(
                     evt.target.getScreenCTM()
                   )
                   setActive({ ...e, screen: { x, y } })
                 }}
                 style={{ cursor: 'pointer' }}>
                <circle cx={e.coords.x} cy={e.coords.y}
                        r='10' fill={e.color} stroke='#222' strokeWidth='1' />
              </g>
            ))}
          </svg>
        </UncontrolledReactSVGPanZoom>

        {/* Pop-up карточка анклава */}
        {active && (
          <div style={{
            position: 'fixed',
            top: active.screen.y + 12,
            left: active.screen.x + 12,
            zIndex: 50,
            maxWidth: 260,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '0.9rem'
          }}>
            <strong style={{ fontSize: 16 }}>{active.name}</strong>
            <div style={{ fontSize: 13, margin: '.4rem 0' }}>
              {active.description}
            </div>
            <div style={{ fontSize: 13 }}>
              🌡 Температура: <b>{active.temp}</b>
            </div>
            <div style={{ fontSize: 12, color: '#666' }}>
              🆔 {active.id}
            </div>

            <div style={{ marginTop: '.8rem', display: 'flex', gap: '.5rem' }}>
              <a href={`/enclaves/${active.id}`}
                 className='btn primary'
                 style={{ padding: '.4rem .8rem', fontSize: 13 }}>
                Подробнее →
              </a>
              <a href={`/contact?to=${active.curatorZid}`}
                 className='btn outline'
                 style={{ padding: '.4rem .8rem', fontSize: 13 }}>
                📬 Связаться
              </a>
              <button onClick={() => setActive(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 18,
                        lineHeight: 1,
                        cursor: 'pointer',
                        marginLeft: 'auto'
                      }}>
                ✖
              </button>
            </div>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#555' }}>
        📍 Координаты условны. Карта — схематическая проекция под Куполом.
      </p>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a href='/enclaves' className='btn primary'>← Назад к анклавам</a>
      </div>
    </main>
  )
}
