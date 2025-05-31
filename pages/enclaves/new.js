import Head from 'next/head'
import { useState } from 'react'

export default function NewEnclavePage() {
  const [coords, setCoords] = useState({ x: null, y: null })

  return (
    <main className="wrapper">
      <Head><title>🆕 Новый анклав | Terra Zetetica</title></Head>
      <h1 className="text-3xl font-bold mb-4">🆕 Регистрация нового анклава</h1>

      <p className="mb-2">Создайте описание анклава, выберите координаты на карте и подайте заявку. Данные можно будет использовать для NFT-паспорта и IPFS.</p>

      <form className="space-y-4 max-w-xl">
        <input name="zid" placeholder="Z-ID куратора" required className="input w-full" />
        <input name="name" placeholder="Название анклава (пример: Дом Единства)" required className="input w-full" />

        <select name="type" required className="input w-full">
          <option value="">Выберите тип анклава</option>
          <option value="Жилой">Жилой</option>
          <option value="Образовательный">Образовательный</option>
          <option value="Культурный">Культурный</option>
          <option value="Исследовательский">Исследовательский</option>
        </select>

        <input name="region" placeholder="Регион / область / район" required className="input w-full" />
        <textarea name="description" placeholder="Описание анклава, цели, кому доступен, что там можно делать" rows={4} required className="textarea w-full" />

        <div>
          <label className="font-semibold block mb-1">📍 Укажите координаты (нажмите по карте):</label>
          <div className="bg-gray-100 p-3 rounded text-sm">
            {coords.x ? `cx=${coords.x}, cy=${coords.y}` : 'Координаты ещё не выбраны.'}
          </div>
          <svg viewBox="0 0 1000 1000" className="w-full mt-2 border rounded shadow-md"
            onClick={(e) => {
              const bounds = e.currentTarget.getBoundingClientRect()
              const x = Math.round(e.clientX - bounds.left)
              const y = Math.round(e.clientY - bounds.top)
              setCoords({ x, y })
            }}>
            <image href="/images/terra-map-2d.webp" x="0" y="0" width="1000" height="1000" />
          </svg>
        </div>

        <input name="rules" placeholder="Правила анклава (если есть)" className="input w-full" />
        <input name="image" placeholder="Ссылка на изображение анклава (если есть)" className="input w-full" />

        <button type="submit" className="btn primary w-full">📤 Сформировать анкла́в</button>
      </form>
    </main>
  )
}
