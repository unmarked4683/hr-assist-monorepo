'use client'

interface TodayRowMarkerProps {
  expanded: boolean
}

export const TodayRowMarker = ({ expanded }: TodayRowMarkerProps) => {
  return (
    <span
      className={`hr-today-marker${expanded ? ' hr-today-marker--expanded' : ''}`}
      aria-label="Dziś"
    >
      <span
        className={`hr-today-marker-text${expanded ? ' hr-today-marker-text--visible' : ''}`}
      >
        DZIŚ
      </span>
    </span>
  )
}
