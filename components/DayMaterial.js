// components/DayMaterial.js
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm      from 'remark-gfm'

export default function DayMaterial({ material }) {
  return (
    <article style={{ maxWidth:800, margin:'0 auto', padding:'1rem' }}>
      <h1>{material.title}</h1>
      {material.subtitle && <h2 style={{ color:'#666' }}>{material.subtitle}</h2>}

      {material.theme && (
        <p><strong>📌 Тема:</strong> {material.theme}</p>
      )}
      {material.summary && (
        <p><strong>🔎 Суть:</strong> {material.summary}</p>
      )}

      <section style={{ margin:'2rem 0' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {material.content_md}
        </ReactMarkdown>
      </section>

      {material.media_json?.map((item,i) => (
        <figure key={i} style={{ marginBottom:'1.5rem' }}>
          {item.type === 'image' && (
            <img src={item.src} alt={item.caption}
                 style={{ maxWidth:'100%', borderRadius:6 }} />
          )}
          {item.type === 'video' && (
            <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
              <iframe
                src={item.src}
                title={item.caption}
                allowFullScreen
                style={{
                  position:'absolute', top:0, left:0,
                  width:'100%', height:'100%', border:0,
                  borderRadius:6
                }}
              />
            </div>
          )}
          {item.caption && (
            <figcaption style={{ color:'#666', fontSize:14, marginTop:4 }}>
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}

      {material.resources?.length > 0 && (
        <section>
          <h3>📎 Ресурсы</h3>
          <ul>
            {material.resources.map((r,i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

{material.takeaway_md && (
  <section style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #ddd' }}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {material.takeaway_md}
    </ReactMarkdown>
  </section>
)}

