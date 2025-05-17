import Link from 'next/link'
import styles from './Nav.module.css'
import LangSwitch from './LangSwitch'

export default function Nav () {
  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.mark} />
        <strong>TERRA ZETETICA</strong>
      </div>

      <nav className={styles.menu}>
        <Link href='/'>Home</Link>
        <Link href='/about'>About</Link>
        <Link href='/apply'>Citizenship</Link>
        <Link href='/blog'>Blog</Link>
        <LangSwitch />
      </nav>

      <Link className={styles.cta} href='/apply'>
        Apply ↗
      </Link>
    </header>
  )
}
