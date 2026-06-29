export const TodayRowMarker = () => {
  return (
    <span
      className="hr-today-marker-hit"
      aria-label="Dziś"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="hr-today-marker">
        <span className="hr-today-marker-text">DZIŚ</span>
      </span>
    </span>
  )
}
