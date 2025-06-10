// utils/useMe.js
import useSWR from 'swr'

const fetcher = async url => {
  const r = await fetch(url)
  if (r.status === 401) throw new Error('unauth')
  return r.json()
}

export default function useMe () {
  return useSWR('/api/me', fetcher, {
    onErrorRetry(err, key, cfg, revalidate, { retryCount }) {
      if (err.message !== 'unauth' || retryCount >= 3) return
      setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 1000)
    }
  })
}
