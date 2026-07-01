'use client'

import { useEffect, useState } from 'react'
import { fetchEmployeeById } from '@/lib/api'
import { useApp } from '@/components/hr/AppContext'
import type { Employee } from '@hr-assist/shared'

export const useEmployee = (id: string): { employee: Employee | null; isLoading: boolean } => {
  const { employees, isEmployeesReady } = useApp()
  const cachedEmployee = employees.find((employee) => employee.id === id) ?? null
  const [employee, setEmployee] = useState<Employee | null>(cachedEmployee)
  const [isLoading, setIsLoading] = useState(!cachedEmployee)

  useEffect(() => {
    if (cachedEmployee) {
      setEmployee(cachedEmployee)
      setIsLoading(false)
      return
    }

    if (!isEmployeesReady) return

    let cancelled = false
    setIsLoading(true)

    fetchEmployeeById(id).then((result) => {
      if (cancelled) return
      setEmployee(result)
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [cachedEmployee, id, isEmployeesReady])

  return { employee, isLoading }
}
