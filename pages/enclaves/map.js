// pages/enclaves/map.js
import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { Viewer } from '../../components/Viewer'  // наш динамический компонент

// Пример данных анклавов (координаты в системе 1000×1000 px)
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
    coords: { x: 555, y: 480 },
    color: '#10b981',
    description: 'Аграрно-исследовательский дом в Брестской области',
    curatorZid: 'ZID-0002',
    temp: '+19 °C'
  }
]

export default function EnclaveMap() {
  const viewerRef = useRef(null)
  const [active, setActive] = useState(null)

  // После монтирования компонента — делаем Fit-to-Viewer
  useEffect(() => {
    // метод fitToViewer() доступен только после рендера на клиенте
    if (viewerRef.current) {
      viewerRef.current.fitToViewer()
    }
  }, [])

  return (
    <main className="wrapper">
      <Head>
        <title>🧭 Карта анклавов | Terra Zetetica</title>
      </Head>

      <h1 style={{ textAlign: 'center', margin: '1.4rem 0' }}>
        🧭 Карта анклавов
      </h1>

      <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}>
        {/** 
         * <Viewer> — это динамически загружаемый компонент, 
         * который в итоге рендерит <UncontrolledReactSVGPanZoom>
         */}
        <Viewer
          ref={viewerRef}
          width={1000}
          height={600}
          detectAutoPan={false}
          toolbarProps={{ position: 'none' }}
          miniatureProps={{ position: 'none' }}
          background="#ffffff"
        >
          <svg width={1000} height={1000}>
            {/** 
             * Схематическая картинка «под Куполом». 
             * Положите файл images/terra-map-2d.webp в папку public/images 
             */}
            <image
              href="/images/terra-map-2d.webp"
              x="0"
              y="0"
              width="1000"
              height="1000"
            />

            {/** Рендерим кружки-точки для каждого анклава */}
            {enclaves.map(e => (
              <g
                key={e.id}
                onClick={ev => {
                  // Преобразуем координаты (SVG → экранные),
                  // чтобы правильно позиционировать pop-up
                  const pt = ev.target.ownerSVGElement.createSVGPoint()
                  pt.x = e.coords.x
                  pt.y = e.coords.y
                  const screenPoint = pt.matrixTransform(
                    ev.target.getScreenCTM()
                  )
                  setActive({
                    ...e,
                    screen: {
                      x: screenPoint.x,
                      y: screenPoint.y
                    }
                  })
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={e.coords.x}
                  cy={e.coords.y}
                  r="10"
                  fill={e.color}
                  stroke="#222"
                  strokeWidth="1"
                />
              </g>
            ))}
          </svg>
        </Viewer>
      </div>

      {/** Поп-ап с подробностями об активном анклаве */}
      {active && (
        <div
          style={{
            position: 'fixed',
            top: active.screen.y + 12,
            left: active.screen.x + 12,
            maxWidth: 260,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '0.9rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 100
          }}
        >
          <strong style={{ fontSize: 16 }}>{active.name}</strong>
          <div style={{ fontSize: 13, margin: '.35rem 0' }}>
            {active.description}
          </div>
          <div style={{ fontSize: 13 }}>
            🌡 Температура: <b>{active.temp}</b>
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            🆔 {active.id}
          </div>

          <div
            style={{
              marginTop: '.8rem',
              display: 'flex',
              gap: '.5rem',
              alignItems: 'center'
            }}
          >
            <a
              href={`/enclaves/${active.id}`}
              className="btn primary"
              style={{ padding: '.35rem .8rem', fontSize: 13 }}
            >
              Подробнее →
            </a>
            <button
              onClick={() => setActive(null)}
              style={{
                marginLeft: 'auto',
                fontSize: 18,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <p
        style={{
          textAlign: 'center',
          fontSize: 14,
          marginTop: 18,
          color: '#555'
        }}
      >
        📍 Координаты условны. Карта — схематическая проекция под Куполом.
      </p>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a href="/enclaves" className="btn primary">
          ← Назад к анклавам
        </a>
      </div>
    </main>
  )
}
