// pages/enclaves/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const Weather = dynamic(()=>import('../../components/Weather'),{ssr:false})
const Gallery = dynamic(()=>import('../../components/Gallery'),{ssr:false})

export default function EnclavePage({e}) {
  return (
    <main className="wrapper">
      <h1>{e.name}</h1>

      <Gallery images={e.gallery}/>
      <Weather lat={e.lat} lon={e.lon}/>

      <section>
        <h2>Паспорт анклава</h2>
        <ul>
          <li>Основан: {e.founded}</li>
          <li>Площадь: {e.areaHa} га</li>
          <li>Жители: {e.population}</li>
          <li>
            Координаты: {e.lat}, {e.lon}{' '}
            <a target="_blank" rel="noreferrer"
               href={`https://www.openstreetmap.org/?mlat=${e.lat}&mlon=${e.lon}#map=12`}>
              Открыть в OSM
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Хроника</h2>
        <p>
          2025 — первая пасека и экспериментальный купольный тепличный модуль.<br/>
          2026 — подключение к распределённой сети «Z-Energy»… (допишите позже)
        </p>
      </section>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const enclaves = (await import('../../data/enclaves.json')).default
  return { paths: enclaves.map(e=>({params:{id:e.id}})), fallback:false }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const enclaves = (await import('../../data/enclaves.json')).default
  return { props:{ e: enclaves.find(x=>x.id===params!.id) } }
}
