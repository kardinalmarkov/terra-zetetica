export default function Apply(){
  return(
    <section className="wrapper">
      <h1>Apply for Citizenship</h1>

      {/* временная форма Google Forms */}
      <iframe
        src="https://docs.google.com/forms/d/e/your-form-id/viewform?embedded=true" height="800" width="100%" frameBorder="0">Загрузка…</iframe>

      <p style={{marginTop:'1rem',fontSize:'.9rem'}}>
        Нет Google-Forms? — мы работаем над on-chain заявкой.
      </p>
    </section>
  )
}
