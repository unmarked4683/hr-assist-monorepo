'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchEmployeeUnexcusedAbsences } from '@/lib/api'
import type { UnexcusedAbsence } from '@hr-assist/shared'

export const useUnexcusedAbsences = (employeeId: string, refreshToken: string | number = 0) => {
  const [absences, setAbsences] = useState<UnexcusedAbsence[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchEmployeeUnexcusedAbsences(employeeId)
      setAbsences(data)
    } catch {
      setAbsences([])
    } finally {
      setIsLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    void reload()
  }, [reload, refreshToken])

  return {
    absences,
    isLoading,
    hasAbsences: absences.length > 0,
    reload,
  }
}
