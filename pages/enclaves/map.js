import Head from 'next/head'
import { useState } from 'react'
import { Home, BookOpen, FlaskConical } from 'lucide-react'

const enclaveTypes = {
  'Жилой': <Home size={12} />,
  'Образовательный': <BookOpen size={12} />,
  'Исследовательский': <FlaskConical size={12} />
}

const enclaves = [
  {
    id: 'TZ-SPB-DOMISTINY',
    name: 'Дом Истины',
    coords: { x: 434, y: 370 },
    color: '#f43f5e',
    description: 'Жилой анклав в Санкт-Петербурге. Открыт по запросу.',
    curatorZid: 'ZID-0001',
    type: 'Жилой'
  },
  {
    id: 'TZ-BY-BRST-ULY-002',
    name: 'Светлый Улей',
    coords: { x: 424, y: 366 },
    color: '#10b981',
    description: 'Дом в Брестской области. Можно жить и развивать инициативы.',
    curatorZid: 'ZID-0001',
    type: 'Жилой'
  }
]

export default function MapPage() {
  const [active, setActive] = useState(null)

  return (
    <main className="wrapper">
      <Head><title>🫭 Карта анклавов | Terra Zetetica</title></Head>

      <h1 className="text-3xl font-bold text-center my-6">🫭 Карта анклавов</h1>

      <div className="relative flex justify-center">
        <svg viewBox="0 0 1000 1000" className="w-full max-w-4xl bg-white border rounded-xl shadow-md">
          <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />

          {enclaves.map((e, i) => (
            <g key={i} onClick={() => setActive(e)} className="cursor-pointer">
              <circle cx={e.coords.x} cy={e.coords.y} r="12" fill={e.color} />
              {e.type && (
                <foreignObject x={e.coords.x - 6} y={e.coords.y - 6} width="12" height="12">
                  <div className="flex items-center justify-center text-white text-xs" style={{ width: '12px', height: '12px' }}>
                    {enclaveTypes[e.type]}
                  </div>
                </foreignObject>
              )}
            </g>
          ))}
        </svg>

        {active && (
          <div className="absolute bg-white border rounded shadow-lg p-4 text-sm max-w-sm z-10"
            style={{ top: active.coords.y * 0.75, left: active.coords.x * 0.75 }}>
            <div className="font-semibold text-lg mb-1">{active.name}</div>
            <p className="mb-1">{active.description}</p>
            <p className="mb-2 text-gray-600 text-sm">🫭 ID: {active.id}</p>
            <div className="space-x-2">
              <a href={`/enclaves/${active.id}`} className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Подробнее →
              </a>
              <a href={`https://terra-zetetica.org/contact?zid=${active.curatorZid}`} className="inline-block px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400">
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
