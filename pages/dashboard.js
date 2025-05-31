// pages/dashboard.js
import Head from 'next/head'

const submissions = [
  {
    zid: 'ZID-0001',
    name: 'Дом Истины',
    type: 'Жилой',
    region: 'Санкт-Петербург',
    description: 'Жилой анклав для просветительской деятельности.',
    rules: 'Открыт только для граждан TZ.',
    coords: { x: 434, y: 370 },
    date: '2025-05-31',
    status: 'new'
  },
  {
    zid: 'ZID-0001',
    name: 'Светлый Улей',
    type: 'Культурный',
    region: 'Брестская обл.',
    description: 'Дом в деревне, подходит для автономного проживания.',
    rules: '',
    coords: { x: 424, y: 366 },
    date: '2025-05-31',
    status: 'new'
  }
]

export default function Dashboard() {
  return (
    <main className="wrapper">
      <Head><title>🗂️ Заявки на анклавы | Admin</title></Head>
      <h1 className="text-3xl font-bold mb-6">🗂️ Заявки на анклавы</h1>

      <table className="w-full text-sm border border-gray-300 rounded overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Z-ID</th>
            <th className="p-2">Название</th>
            <th className="p-2">Тип</th>
            <th className="p-2">Регион</th>
            <th className="p-2">Дата</th>
            <th className="p-2">Статус</th>
            <th className="p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{s.zid}</td>
              <td className="p-2 font-medium">{s.name}</td>
              <td className="p-2">{s.type}</td>
              <td className="p-2">{s.region}</td>
              <td className="p-2 text-xs">{s.date}</td>
              <td className="p-2">{s.status}</td>
              <td className="p-2">
                <button className="text-blue-500 hover:underline mr-2">👁️ Просмотр</button>
                <button className="text-green-600 hover:underline mr-2">✅ Принять</button>
                <button className="text-red-500 hover:underline">⛔ Отклонить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
