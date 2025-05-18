// pages/apply.js
import { useState } from 'react'
import Head from 'next/head'

export default function Apply() {
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const res = await fetch('/api/apply', {
      method: 'POST',
      body: JSON.stringify({
        email: form.get('email'),
        name:  form.get('name'),
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    setStatus(data.message)
  }

  return (
    <main className="wrapper">
      <Head><title>Гражданство | Terra Zetetica</title></Head>
      <h1>Как стать гражданином</h1>

      {status
        ? <p>{status}</p>
        : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem', maxWidth:400 }}>
            <label>
              Имя
              <input type="text" name="name" required />
            </label>
            <label>
              E-mail
              <input type="email" name="email" required />
            </label>
            <button type="submit" className="btn primary">
              Получить Z-ID
            </button>
          </form>
        )
      }
    </main>
  )
}
