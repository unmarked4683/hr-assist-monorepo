'use client'

import { memo } from 'react'
import { MapPin } from 'lucide-react'
import {
  employeeNeedsAction,
  getLocationLabel,
  toListAttendanceStatus,
  type Employee,
  type Location,
} from '@hr-assist/shared'
import { AttendanceStatusBadge } from '../shared/AttendanceStatusBadge'

interface EmployeeListRowProps {
  employee: Employee
  onSelect: (employeeId: string) => void
}

const LocationBadge = memo(function LocationBadge({ location }: { location: Location }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
      <MapPin size={10} />
      {getLocationLabel(location)}
    </span>
  )
})

export const EmployeeListRow = memo(function EmployeeListRow({
  employee,
  onSelect,
}: EmployeeListRowProps) {
  const needsAction = employeeNeedsAction(employee)

  return (
    <tr
      onClick={() => onSelect(employee.id)}
      className={[
        'hr-table-row hr-table-row-clickable',
        needsAction && 'animate-pulse-red-row',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <td className="px-3 py-2.5 text-center font-medium text-foreground">{employee.firstName}</td>
      <td className="px-3 py-2.5 text-center text-foreground">{employee.lastName}</td>
      <td className="px-3 py-2.5 text-center text-muted-foreground">{employee.position}</td>
      <td className="px-3 py-2.5 text-center">
        <LocationBadge location={employee.location} />
      </td>
      <td className="px-3 py-2.5 text-center">
        <AttendanceStatusBadge
          variant="list"
          status={toListAttendanceStatus(needsAction)}
        />
      </td>
    </tr>
  )
}, (previous, next) => previous.employee === next.employee && previous.onSelect === next.onSelect)
