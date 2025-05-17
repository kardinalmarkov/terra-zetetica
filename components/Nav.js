import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        <span className={styles.mark} />
        <strong>Terra Zetetica</strong>
      </div>

      <nav className={styles.menu}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/apply">Citizenship</Link>
        <Link href="/blog">Blog</Link>
      </nav>

      <Link className={styles.cta} href="/apply">
        Apply&nbsp;↗
      </Link>
    </header>
  )
}
