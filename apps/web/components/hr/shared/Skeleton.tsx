import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <span className={cn('hr-skeleton', className)} aria-hidden />
)
