import Head from 'next/head'
import Link from 'next/link'

export default function MapPage() {
  return (
    <main className="wrapper">
      <Head><title>🧭 Карта анклавов | Terra Zetetica</title></Head>

      <h1 className="text-3xl font-bold text-center my-6">🧭 Карта анклавов</h1>

      <div className="flex justify-center">
        <svg viewBox="0 0 1000 1000" className="w-full max-w-4xl bg-white border rounded-xl shadow-md"
          onClick={(e) => {
            const bounds = e.currentTarget.getBoundingClientRect()
            const x = Math.round(e.clientX - bounds.left)
            const y = Math.round(e.clientY - bounds.top)
            alert(`Координаты: cx=${x}, cy=${y}`)
          }}>
          <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />

          {/* Санкт-Петербург */}
          <a href="/enclaves/TZ-SPB-DOMISTINY">
            <circle cx="778" cy="238" r="10" fill="#f43f5e" />
            <text x="416" y="371" fontSize="12" fill="#111">Дом Истины</text>
          </a>

          {/* Брест / Ивацевичи */}
          <a href="/enclaves/TZ-BY-BRST-ULY-002">
            <circle cx="424" cy="366" r="10" fill="#10b981" />
            <text x="758" y="277" fontSize="12" fill="#111">Светлый Улей</text>
          </a>
        </svg>
      </div>

      <p className="text-center text-sm mt-4 text-gray-500">
        🧭 Координаты условны. Карта — схематическая проекция под Куполом.
      </p>

      <div className="text-center mt-6">
        <Link href="/enclaves" className="inline-block px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition">
          ← Назад
        </Link>
      </div>
    </main>
  )
}
