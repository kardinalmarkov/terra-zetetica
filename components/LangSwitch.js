import { useRouter } from 'next/router'
import Link from 'next/link'

export default function LangSwitch () {
  const { locale, asPath } = useRouter()
  const next = locale === 'ru' ? 'en' : 'ru'
  return (
    <Link href={asPath} locale={next} style={{ marginLeft: '1rem', fontSize: '.9rem' }}>
      {next.toUpperCase()}
    </Link>
  )
}
