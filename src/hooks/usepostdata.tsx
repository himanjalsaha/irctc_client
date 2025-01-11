import { useState } from 'react'
import axios from 'axios'

const usePostData = (url: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<any>(null)

  const postData = async (payload: any) => {
    setLoading(true)
    setError('') // Reset error before each request

    try {
      const response = await axios.post(url, payload)
      setData(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { postData, loading, error, data }
}

export default usePostData
