'use client'

import { AuthGuard } from '@/components/hr/auth/AuthGuard'

export default function HolidaysLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
