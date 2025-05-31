import Head from 'next/head'
import { useState } from 'react'

export default function NewEnclavePage() {
  const [form, setForm] = useState({ zid: '', name: '', type: '', region: '', description: '', rules: '', image: '', coords: null })
  const [submitted, setSubmitted] = useState(false)

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const body = `\nНовый анклав от ${form.zid}\n\nНазвание: ${form.name}\nТип: ${form.type}\nРегион: ${form.region}\nОписание: ${form.description}\nПравила: ${form.rules}\nКоординаты: ${form.coords ? `cx=${form.coords.x}, cy=${form.coords.y}` : 'не указаны'}\nИзображение: ${form.image}`
    fetch("https://formspree.io/f/mbloweze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: body })
    })
  }

  return (
    <main className="wrapper">
      <Head><title>🆕 Новый анклав | Terra Zetetica</title></Head>
      <h1 className="text-3xl font-bold mb-4">🆕 Регистрация нового анклава</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white border p-6 rounded-xl shadow-md">
        <input name="zid" value={form.zid} onChange={update} placeholder="Z-ID куратора" required className="input w-full" />
        <input name="name" value={form.name} onChange={update} placeholder="Название анклава (пример: Дом Единства)" required className="input w-full" />

        <select name="type" value={form.type} onChange={update} required className="input w-full">
          <option value="">Выберите тип анклава</option>
          <option value="Жилой">Жилой</option>
          <option value="Образовательный">Образовательный</option>
          <option value="Культурный">Культурный</option>
          <option value="Исследовательский">Исследовательский</option>
        </select>

        <input name="region" value={form.region} onChange={update} placeholder="Регион / область / район" required className="input w-full" />
        <textarea name="description" value={form.description} onChange={update} placeholder="Описание анклава, цели, кому доступен, что там можно делать" rows={4} required className="textarea w-full" />

        <div>
          <label className="font-semibold block mb-1">📍 Укажите координаты (нажмите по карте):</label>
          <div className="bg-gray-100 p-3 rounded text-sm">
            {form.coords ? `cx=${form.coords.x}, cy=${form.coords.y}` : 'Координаты ещё не выбраны.'}
          </div>
          <svg viewBox="0 0 1000 1000" className="w-full mt-2 border rounded shadow-md cursor-crosshair"
            onClick={(e) => {
              const bounds = e.currentTarget.getBoundingClientRect()
              const x = Math.round(e.clientX - bounds.left)
              const y = Math.round(e.clientY - bounds.top)
              setForm({ ...form, coords: { x, y } })
            }}>
            <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />
          </svg>
        </div>

        <input name="rules" value={form.rules} onChange={update} placeholder="Правила анклава (если есть)" className="input w-full" />
        <input name="image" value={form.image} onChange={update} placeholder="Ссылка на изображение анклава (если есть)" className="input w-full" />

        <button type="submit" className="btn primary w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded">📤 Сформировать анклав</button>
      </form>

      {submitted && (
        <div className="bg-white border rounded p-6 mt-6 shadow-lg max-w-xl">
          <h2 className="text-xl font-bold mb-2">📄 Превью анклава</h2>
          <p><strong>Название:</strong> {form.name}</p>
          <p><strong>Z-ID:</strong> {form.zid}</p>
          <p><strong>Тип:</strong> {form.type}</p>
          <p><strong>Регион:</strong> {form.region}</p>
          <p><strong>Описание:</strong> {form.description}</p>
          <p><strong>Правила:</strong> {form.rules || '—'}</p>
          <p><strong>Координаты:</strong> {form.coords ? `cx=${form.coords.x}, cy=${form.coords.y}` : '—'}</p>
          {form.image && <img src={form.image} alt="Изображение анклава" className="mt-2 rounded shadow max-w-xs" />}
        </div>
      )}
    </main>
  )
}
