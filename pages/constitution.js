// pages/constitution.js
import { useRouter } from 'next/router';

const TEXT = {
  ru: `
### Конституция Terra Zetetica

**Преамбула**  
Мы, свободные...
  
**Глава 1. Основы**  
1.1. Наименование...  
…  
`,
  en: `  
### Constitution of Terra Zetetica

**Preamble**  
We, the free...
  
**Chapter 1. Foundations**  
1.1. Name...  
…  
`
};

export default function Constitution() {
  const { locale } = useRouter();
  return (
    <div className="prose max-w-none p-8">
      <div dangerouslySetInnerHTML={{ __html: TEXT[locale] }} />
      <p className="mt-12 text-sm text-gray-500">
        📜 Полный текст в IPFS: 
        <a
          href="https://gateway.pinata.cloud/ipfs/YOUR_CID"
          target="_blank"
          rel="noreferrer"
        >
          {locale==='ru' ? 'Конституция (IPFS)' : 'Full Constitution (IPFS)'}
        </a>
      </p>
    </div>
  );
}
