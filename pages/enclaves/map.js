// pages/enclaves/map.js
import Head from 'next/head';
import { useState, useRef } from 'react';
import { Viewer } from '../../components/Viewer'; // Динамический импорт со ssr:false

// Список анклавов с их координатами (условная координатная система 1000×1000)
const enclaves = [
  {
    id: 'TZ-SPB-DOMISTINY',
    name: 'Дом Истины',
    descr: 'Жилой анклав в Санкт-Петербурге',
    color: '#f43f5e',
    x: 540,
    y: 470,
    temp: '+17 °C',
  },
  {
    id: 'TZ-BY-BRST-ULY-002',
    name: 'Светлый Улей',
    descr: 'Аграрно-исследовательский дом в Брестской области',
    color: '#10b981',
    x: 555,
    y: 480,
    temp: '+19 °C',
  },
  // ... можно добавить ещё анклавов
];

export default function EnclaveMap() {
  const viewerRef = useRef(null);
  const [popup, setPopup] = useState(null);

  return (
    <main className="wrapper">
      <Head>
        <title>🗺️ Карта анклавов | Terra Zetetica</title>
      </Head>

      <h1 style={{ textAlign: 'center', margin: '1.4rem 0' }}>
        🗺️ Карта анклавов
      </h1>

      <Viewer
        ref={viewerRef}
        width={1000}
        height={600}
        detectAutoPan={false}
        toolbarProps={{ position: 'none' }}
        miniatureProps={{ position: 'none' }}
        // Как только SVG загрузился, центрируем / масштабируем под окно
        onSVGLoad={(viewerInstance) => {
          // Теперь гарантированно доступен метод fitToViewer
          viewerInstance.fitToViewer();
        }}
        background="#ffffff"
      >
        <svg width="1000" height="1000">
          {/* Сам фон/картинка карты под Куполом */}
          <image
            href="/images/terra-map-2d.webp"
            width="1000"
            height="1000"
          />

          {enclaves.map((e) => (
            <g
              key={e.id}
              onClick={(evt) => {
                // Преобразуем координаты анклава в экранные (screen x,y)
                const pt = evt.target.ownerSVGElement.createSVGPoint();
                pt.x = e.x;
                pt.y = e.y;
                const { x, y } = pt.matrixTransform(
                  evt.target.getScreenCTM()
                );
                setPopup({ ...e, screen: { x, y } });
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={e.x}
                cy={e.y}
                r="10"
                fill={e.color}
                stroke="#222"
                strokeWidth="1"
              />
            </g>
          ))}
        </svg>
      </Viewer>

      {/* Выводим pop-up, если установлен popup */}
      {popup && (
        <div
          style={{
            position: 'fixed',
            top: popup.screen.y + 12,
            left: popup.screen.x + 12,
            maxWidth: 260,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '0.9rem',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)',
            zIndex: 100,
          }}
        >
          <strong>{popup.name}</strong>
          <div style={{ fontSize: 13, margin: '.35rem 0' }}>
            {popup.descr}
          </div>
          <div style={{ fontSize: 13 }}>🌡 {popup.temp}</div>
          <small style={{ color: '#666' }}>🆔 {popup.id}</small>

          <div
            style={{
              marginTop: '.8rem',
              display: 'flex',
              gap: '.5rem',
            }}
          >
            <a
              href={`/enclaves/${popup.id}`}
              className="btn primary"
              style={{ fontSize: 13, padding: '.35rem .8rem' }}
            >
              Подробнее →
            </a>
            <button
              onClick={() => setPopup(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <p
        style={{
          textAlign: 'center',
          fontSize: 14,
          marginTop: 18,
          color: '#555',
        }}
      >
        📍 Координаты условны. Карта — схематическая проекция под Куполом.
      </p>
    </main>
  );
}
