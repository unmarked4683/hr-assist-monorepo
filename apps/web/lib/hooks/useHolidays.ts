'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { fetchHolidays, syncHolidays } from '@/lib/api/holidays'

const HOLIDAYS_QUERY_KEY = ['holidays'] as const
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export function useHolidays() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: HOLIDAYS_QUERY_KEY,
    queryFn: fetchHolidays,
    staleTime: TWENTY_FOUR_HOURS_MS,
  })

  const synchronize = useCallback(async () => {
    await syncHolidays()
    await queryClient.invalidateQueries({ queryKey: HOLIDAYS_QUERY_KEY })
  }, [queryClient])

  return {
    holidays: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSyncing: query.isFetching && !query.isLoading,
    synchronize,
  }
}
