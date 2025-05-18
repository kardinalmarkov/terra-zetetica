export default function Apply() {
  return (
    <section className="wrapper">
      <h1>Как стать гражданином</h1>
      <ol style={{ margin: '1rem 0', paddingLeft: '1.25rem' }}>
        <li>Получите свой <strong>Z-ID</strong> — заполните простую форму с базовыми данными.</li>
        <li>Приобретите NFT-паспорт Terra Zetetica — он автоматически закрепляет ваше гражданство.</li>
        <li>Подтвердите свою заявку через кошелёк (MetaMask и др.).</li>
        <li>Ваша заявка попадёт на рассмотрение сообщества DAO и вы получите окончательное подтверждение.</li>
      </ol>
      <a href="/passport_versions" className="btn primary" style={{ marginRight: '1rem' }}>
        Получить Z-ID
      </a>
      <a href="/passport_versions" className="btn outline">
        Купить NFT-паспорт
      </a>
    </section>
  )
}
