'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/hr/AppContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login')
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return children
}
