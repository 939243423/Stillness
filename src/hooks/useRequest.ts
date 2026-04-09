import { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'

interface UseRequestOptions<T> {
  /** 默认数据 */
  defaultData?: T
  /** 是否自动执行，默认 true */
  immediate?: boolean
}

interface UseRequestReturn<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  run: (...args: any[]) => Promise<T | undefined>
}

/**
 * 异步请求 Hook，封装 loading/error 状态
 */
export function useRequest<T = any>(
  service: (...args: any[]) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T> {
  const { defaultData } = options
  const [data, setData] = useState<T | undefined>(defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const run = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true)
        setError(null)
        const result = await service(...args)
        setData(result)
        return result
      } catch (err) {
        const e = err as Error
        setError(e)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [service]
  )

  return { data, loading, error, run }
}
