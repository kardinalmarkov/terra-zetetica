import Head from 'next/head'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function EnclaveMapPage() {
  const enclaves = [
    {
      id: 'TZ-SPB-DOMISTINY',
      name: 'Дом Истины',
      position: [59.9876, 30.1901],
      curator: 'ZID-0001'
    }
  ]

  return (
    <main className="wrapper">
      <Head>
        <title>🧭 Карта анклавов | Terra Zetetica</title>
      </Head>

      <h1 className="text-3xl font-bold text-center my-6">🧭 Интерактивная карта анклавов</h1>

      <div className="w-full h-[75vh] rounded-xl overflow-hidden shadow-xl border">
        <MapContainer center={[54, 38]} zoom={4} scrollWheelZoom={true} className="w-full h-full z-0">
          <TileLayer
            attribution="&copy; Terra Zetetica | Leaflet"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {enclaves.map(e => (
            <Marker key={e.id} position={e.position}>
              <Popup>
                <strong>{e.name}</strong><br />
                Куратор: {e.curator}<br />
                <a href={`/enclaves/${e.id}`} className="text-blue-500">Открыть →</a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="text-center text-sm mt-4 text-gray-500">
        ⚠️ Все координаты условны и не нарушают приватность граждан.
      </p>
    </main>
  )
}
