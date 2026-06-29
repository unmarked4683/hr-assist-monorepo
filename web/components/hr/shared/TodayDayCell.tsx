'use client'

import { useState } from 'react'
import { TodayRowMarker } from './TodayRowMarker'

interface TodayDayCellProps {
  day: number
}

export const TodayDayCell = ({ day }: TodayDayCellProps) => {
  const [active, setActive] = useState(false)

  return (
    <td
      className="hr-today-day-cell relative overflow-visible px-3 py-2.5 text-center font-medium tabular-nums"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <TodayRowMarker expanded={active} />
      {day}
    </td>
  )
}
