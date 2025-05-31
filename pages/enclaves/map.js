import Head from 'next/head'
import { useState } from 'react'

const enclaves = [
  {
    id: 'TZ-SPB-DOMISTINY',
    name: 'Дом Истины',
    coords: { x: 778, y: 238 },
    color: '#f43f5e',
    description: 'Жилой анклав в Санкт-Петербурге. Открыт по запросу.',
  },
  {
    id: 'TZ-BY-BRST-ULY-002',
    name: 'Светлый Улей',
    coords: { x: 424, y: 366 },
    color: '#10b981',
    description: 'Дом в Ивацевичском районе. Можно заниматься и развивать.',
  }
]

export default function MapPage() {
  const [hovered, setHovered] = useState(null)

  return (
    <main className="wrapper">
      <Head><title>🧭 Карта анклавов | Terra Zetetica</title></Head>

      <h1 className="text-3xl font-bold text-center my-6">🧭 Карта анклавов</h1>

      <div className="relative flex justify-center">
        <svg viewBox="0 0 1000 1000" className="w-full max-w-4xl bg-white border rounded-xl shadow-md"
          onClick={(e) => {
            const bounds = e.currentTarget.getBoundingClientRect()
            const x = Math.round(e.clientX - bounds.left)
            const y = Math.round(e.clientY - bounds.top)
            alert(`📍 Координаты: cx=${x}, cy=${y}`)
          }}>
          <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />

          {enclaves.map((e, i) => (
            <g key={i} onMouseEnter={() => setHovered(e)} onMouseLeave={() => setHovered(null)}>
              <circle cx={e.coords.x} cy={e.coords.y} r="10" fill={e.color} />
              <text x={e.coords.x + 12} y={e.coords.y + 4} fontSize="12" fill="#111">{e.name}</text>
            </g>
          ))}
        </svg>

        {hovered && (
          <div className="absolute bg-white border rounded shadow-lg p-4 text-sm max-w-sm" style={{
            top: hovered.coords.y * 0.75,
            left: hovered.coords.x * 0.72
          }}>
            <div className="font-semibold text-lg mb-1">{hovered.name}</div>
            <p className="mb-2">{hovered.description}</p>
            <a href={`/enclaves/${hovered.id}`} className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Подробнее →
            </a>
          </div>
        )}
      </div>

      <p className="text-center text-sm mt-4 text-gray-500">
        📍 Координаты условны. Карта — схематическая проекция под Куполом.
      </p>

      <div className="text-center mt-6">
        <a href="/enclaves" className="inline-block px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition">
          ← Назад к анклавам
        </a>
      </div>
    </main>
  )
}
