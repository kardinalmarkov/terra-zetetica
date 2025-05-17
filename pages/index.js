export default function Home() {
  return (
    <main className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      <img src='https://images.unsplash.com/photo-1526401485004-65322903cb4d?auto=format&fit=crop&w=1950&q=80' alt='City' className='absolute inset-0 w-full h-full object-cover brightness-75'/>
      <div className='relative z-10 text-center max-w-2xl px-4'>
        <h1 className='text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg'>
          Добро пожаловать<br/>в Terra Zetetica
        </h1>
        <p className='mt-4 text-lg text-slate-200'>
          Самое свободное цифровое сообщество, работающее на блокчейне.
        </p>
        <div className='mt-8 flex gap-4 justify-center'>
          <a href='#' className='px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded shadow hover:bg-yellow-300 transition'>Стать гражданином</a>
          <a href='#' className='px-6 py-3 border border-white text-white font-semibold rounded hover:bg-white/10 transition'>Получить токены</a>
        </div>
      </div>
    </main>
  )
}
