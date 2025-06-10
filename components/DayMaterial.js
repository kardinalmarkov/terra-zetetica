// components/DayMaterial.js
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function DayMaterial({ material = {} }) {
  return (
    <article style={{ maxWidth:800, margin:'0 auto', padding:'1rem' }}>
      <h1>{material.title}</h1>
      {material.subtitle && <h2 style={{ color:'#666' }}>{material.subtitle}</h2>}

      {!!material.theme   && <p><strong>📌 Тема:</strong> {material.theme}</p>}
      {!!material.summary && <p><strong>🔎 Суть:</strong> {material.summary}</p>}

      {!!material.content_md && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{material.content_md}</ReactMarkdown>
      )}

      {Array.isArray(material.media_json) && material.media_json.map((m,i)=>(
        <figure key={i} style={{ margin:'1.5rem 0' }}>
          {m.type==='image' && (
            <img src={m.src} alt={m.caption} style={{ maxWidth:'100%', borderRadius:6 }}/>
          )}
          {m.type==='video' && (
            <div style={{position:'relative',paddingBottom:'56.25%',height:0}}>
              <iframe src={m.src} title={m.caption} allowFullScreen
                style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:0}}/>
            </div>
          )}
          {m.caption && <figcaption style={{ color:'#666', fontSize:14 }}>{m.caption}</figcaption>}
        </figure>
      ))}

      {!!material.resources?.length && (
        <section>
          <h3>📎 Ресурсы</h3>
          <ul>{material.resources.map((r,i)=>(
            <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.label}</a></li>
          ))}</ul>
        </section>
      )}

      {!!material.takeaway_md && (
        <section style={{ marginTop:'2rem', borderTop:'1px solid #ddd', paddingTop:'1rem' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{material.takeaway_md}</ReactMarkdown>
        </section>
      )}
    </article>
  )
}
