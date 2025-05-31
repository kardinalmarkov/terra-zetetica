import Head from 'next/head'
import Link from 'next/link'

export default function EnclavePage() {
  return (
    <main className="wrapper">
      <Head>
        <title>🧱 Анклавы | Terra Zetetica</title>
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

      <h2 className="text-2xl font-semibold mt-8 mb-2">📄 Форма заявки</h2>
      <form action="https://formspree.io/f/mbloweze" method="POST" className="space-y-3 max-w-md">
        <input name="name" placeholder="Ваше имя" required className="input w-full" />
        <textarea name="message" placeholder="Описание анклава" rows={5} required className="textarea w-full" />
        <button type="submit" className="btn primary w-full">📬 Отправить заявку</button>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🧭 Быстрые ссылки:</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><Link href="/enclaves/map" className="text-blue-600 hover:underline">🗺️ Интерактивная карта анклавов</Link></li>
        <li><Link href="/enclaves/mine" className="text-blue-600 hover:underline">🧱 Мои анклавы</Link></li>
        <li><Link href="/enclaves/TZ-SPB-DOMISTINY" className="text-blue-600 hover:underline">🏡 Дом Истины</Link></li>
        <li><Link href="/enclaves/apply" className="text-blue-600 hover:underline">📬 Подать анкла́в отдельно</Link></li>
      </ul>
    </main>
  )
}
