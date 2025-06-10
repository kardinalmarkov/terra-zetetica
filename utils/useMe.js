// utils/useMe.js  — переиспользуем в dom.js и lk.js
import useSWR from 'swr'

const fetcher = async url => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error('unauth')
  return res.json()
}

export default function useMe () {
  return useSWR('/api/me', fetcher, {
    // через 1 сек. повторяем в случае 401 (кука может появиться после редиректа)
    onErrorRetry(err, key, cfg, revalidate, { retryCount }) {
      if (err.message !== 'unauth' || retryCount >= 3) return
      setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 1000)
    }
  })
}
