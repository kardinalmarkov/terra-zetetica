export default function Home() {
  return (
    <main className="hero">
      <div className="inner">
        <h1>
          Добро пожаловать<br/>
          в <span>Terra Zetetica</span>
        </h1>

        <p className="tagline">
          Утопия сетевого государства,<br/>
          построенная на блокчейне
        </p>

        <div className="actions">
          <a href="/apply" className="btn primary">
            Стать гражданином
          </a>
          <a href="#" className="btn outline">
            Получить токены
          </a>
        </div>
      </div>
    </main>
  );
}
