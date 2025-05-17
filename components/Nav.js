// components/Nav.js
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function Nav() {
  const { t } = useTranslation('common');
  const { locale, asPath } = useRouter();
  const alt = locale === 'ru' ? 'en' : 'ru';

  return (
    <nav className="flex items-center">
      <Link href="/" locale={locale}>
        <a className="mr-6 font-bold">TERRA ZETETICA</a>
      </Link>
      {['home','about','citizenship','blog'].map((key) => (
        <Link key={key} href={key === 'home' ? '/' : `/${key}`} locale={locale}>
          <a className="mx-3">{t(`nav.${key}`)}</a>
        </Link>
      ))}
      <Link href="/" locale={alt}>
        <a className="ml-6">{alt.toUpperCase()}</a>
      </Link>
      <Link href="/apply" locale={locale}>
        <a className="ml-auto px-4 py-2 bg-yellow-400 rounded">{t('nav.apply')} ↗</a>
      </Link>
    </nav>
  );
}
