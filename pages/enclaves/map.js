import Head from 'next/head'
import { useState } from 'react'

const enclaves = [
  {
    id: 'TZ-SPB-DOMISTINY',
    name: 'Дом Истины',
    coords: { x: 540, y: 470 },
    color: '#f43f5e',
    description: 'Жилой анклав в Санкт-Петербурге. Открыт по запросу.',
    curatorZid: 'ZID-0001',
    icons: ['🏡', '🧪']
  },
  {
    id: 'TZ-BY-BRST-ULY-002',
    name: 'Светлый Улей',
    coords: { x: 550, y: 480 },
    color: '#10b981',
    description: 'Дом в Брестской области. Можно жить и развивать инициативы.',
    curatorZid: 'ZID-0001',
    icons: ['🏡', '📚']
  }
]

export default function MapPage() {
  const [active, setActive] = useState(null)

  return (
    <main className="wrapper">
      <Head><title>🧭 Карта анклавов | Terra Zetetica</title></Head>

      <h1 className="text-3xl font-bold text-center my-6">🧭 Карта анклавов</h1>

      <div className="relative flex justify-center">
        <svg viewBox="0 0 1000 1000" className="w-full max-w-4xl bg-white border rounded-xl shadow-md">
          <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />

          {enclaves.map((e, i) => (
            <g key={i} onClick={() => setActive(e)} className="cursor-pointer">
              <circle cx={e.coords.x} cy={e.coords.y} r="12" fill={e.color} />
              <text x={e.coords.x} y={e.coords.y + 4} textAnchor="middle" fontSize="14" fill="#fff">
                {e.icons.join(' ')}
              </text>
            </g>
          ))}
        </svg>

        {active && (
          <div className="absolute bg-white border rounded shadow-lg p-4 text-sm max-w-sm z-10"
            style={{
              top: active.coords.y * 0.75,
              left: active.coords.x * 0.75
            }}>
            <div className="font-semibold text-lg mb-1">{active.name}</div>
            <p className="mb-1">{active.description}</p>
            <p className="mb-2 text-gray-600 text-sm">🧭 ID: {active.id}</p>
            <div className="space-x-2">
              <a href={`/enclaves/${active.id}`} className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Подробнее →
              </a>
              <a href={`/contact?to=${active.curatorZid}`} className="inline-block px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400">
                📬 Связаться
              </a>
              <button onClick={() => setActive(null)} className="inline-block px-3 py-1 text-gray-500 hover:text-black">
                ✖
              </button>
            </div>
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
