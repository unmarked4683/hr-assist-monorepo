'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/hr/AppContext'

export default function HomePage() {
  const { isLoggedIn } = useApp()
  const router = useRouter()

  useEffect(() => {
    router.replace(isLoggedIn ? '/employees' : '/login')
  }, [isLoggedIn, router])

  return null
}
