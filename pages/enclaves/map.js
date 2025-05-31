import Head from 'next/head'
import Link from 'next/link'

export default function MapPage() {
  return (
    <main className="wrapper">
      <Head><title>🧭 Карта анклавов | Terra Zetetica</title></Head>
      <h1 className="text-3xl font-bold text-center my-6">🧭 Карта анклавов</h1>

      <div className="flex justify-center">
        <svg viewBox="0 0 1000 1000" className="w-full max-w-4xl bg-white border rounded-xl shadow-md">
          <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />

          {/* Санкт-Петербург */}
          <a href="/enclaves/TZ-SPB-DOMISTINY">
            <circle cx="705" cy="265" r="10" fill="#f43f5e" />
            <text x="720" y="270" fontSize="12" fill="#111">Дом Истины</text>
          </a>

          {/* Ивацевичи (примерное расположение) */}
          <a href="/enclaves/TZ-BY-BRST-ULY-002">
            <circle cx="670" cy="335" r="10" fill="#10b981" />
            <text x="685" y="340" fontSize="12" fill="#111">Светлый Улей</text>
          </a>
        </svg>
      </div>

      <p className="text-center text-sm mt-4 text-gray-500"> Координаты условные. Карта — схематическая проекция под Куполом.</p>

      <div className="text-center mt-6">
        <Link href="/enclaves" className="btn outline">← Назад</Link>
      </div>
    </main>
  )
}
