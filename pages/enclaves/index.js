import Head from 'next/head'
import Link from 'next/link'

export default function EnclavePage() {
  return (
    <main className="wrapper">
      <Head>
        <title>🧱 !Анклавы | Terra Zetetica</title>
      </Head>

      <h1 className="text-4xl font-bold mb-4">🧱 Анклавы Terra Zetetica</h1>

      <p className="mb-4">Анклав — это автономная территория под Куполом, зарегистрированная в системе Terra Zetetica. Он может быть исследовательским, образовательным, духовным или жилым.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">📌 Как зарегистрировать анклав?</h2>
      <ol className="list-decimal list-inside space-y-1">
        <li>Быть гражданином с действующим <strong>Z-ID</strong></li>
        <li>Подготовить описание анклава (адрес, назначение, правила)</li>
        <li>Загрузить данные в IPFS</li>
        <li>Подать заявку через DAO или форму</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🧭 Быстрые ссылки:</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><Link href="/enclaves/map" className="text-blue-600 hover:underline">🗺️ Интерактивная карта анклавов</Link></li>
        <li><Link href="/enclaves/new" className="text-blue-600 hover:underline">🆕 Создать анклав (расширенно)</Link></li>
      </ul>
    </main>
  )
}
