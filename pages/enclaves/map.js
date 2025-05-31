import Head from 'next/head'
import Link from 'next/link'

export default function EnclaveMapSVG() {
  return (
    <main className="wrapper">
      <Head>
        <title>🧭 Карта анклавов (SVG) | Terra Zetetica</title>
      </Head>

      <h1 className="text-3xl font-bold text-center my-6">🧭 Карта анклавов (SVG)</h1>

      <div className="flex justify-center">
        <svg viewBox="0 0 1000 500" className="w-full max-w-4xl border rounded-xl shadow-md bg-blue-50">
          {/* Фон карты */}
          <image href="/images/terra-map-2d.png" x="0" y="0" width="1000" height="500" />

          {/* Маркер анклава */}
          <a href="/enclaves/TZ-SPB-DOMISTINY">
            <circle cx="780" cy="200" r="10" fill="#ef4444" />
            <text x="800" y="205" fontSize="14" fill="#111">Дом Истины</text>
          </a>
        </svg>
      </div>

      <p className="text-center text-sm mt-4 text-gray-500">
        ⚠️ Местоположения условные и адаптированы под 2D-схему под Куполом.
      </p>

      <div className="text-center mt-6">
        <Link href="/enclaves" className="btn outline">← Назад к анклавам</Link>
      </div>
    </main>
  )
}
