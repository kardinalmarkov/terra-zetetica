import Head from 'next/head'

export default function ApplyEnclavePage() {
  return (
    <main className="wrapper">
      <Head><title>📬 Подать анклав | Terra Zetetica</title></Head>

      <h1 className="text-3xl font-bold mb-4">📬 Подать анкла́в</h1>
      <p>Вы гражданин с Z-ID? Отлично! Здесь вы можете предложить свой анклав в сеть Terra Zetetica.</p>

      <form action="https://formspree.io/f/mbloweze" method="POST" className="space-y-4 mt-4 max-w-xl">
        <input name="name" placeholder="Ваше имя / Z-ID" required className="input w-full" />
        <input name="region" placeholder="Область / Район" required className="input w-full" />
        <input name="address" placeholder="Адрес анклава (примерный)" className="input w-full" />
        <textarea name="description" placeholder="Краткое описание анклава, цели, тип, правила" rows={5} required className="textarea w-full" />
        <button type="submit" className="btn primary w-full">📬 Отправить</button>
      </form>
    </main>
  )
}
