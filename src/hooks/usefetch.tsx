import { useState, useEffect } from 'react'

interface FetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

const useFetch = (url: string, options: FetchOptions = {}) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: options.headers || { 'Content-Type': 'application/json' },
          body: options.body ? JSON.stringify(options.body) : null
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options])

  return { data, loading, error }
}

export default useFetch
