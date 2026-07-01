import type { DayRecord, Employee } from '@hr-assist/shared'

const areDayRecordsEqual = (left: DayRecord[], right: DayRecord[]): boolean => {
  if (left.length !== right.length) return false

  const rightByDate = new Map(right.map((record) => [record.date, record.status]))

  return left.every(
    (record) => rightByDate.get(record.date) === record.status && rightByDate.delete(record.date),
  )
}

export const areEmployeesEqual = (left: Employee, right: Employee): boolean =>
  left.id === right.id &&
  left.firstName === right.firstName &&
  left.lastName === right.lastName &&
  left.pesel === right.pesel &&
  left.contractType === right.contractType &&
  left.workDimension === right.workDimension &&
  left.startHour === right.startHour &&
  left.endHour === right.endHour &&
  left.location === right.location &&
  left.position === right.position &&
  left.companyId === right.companyId &&
  areDayRecordsEqual(left.dayRecords, right.dayRecords)

export const mergeEmployeesPreservingReferences = (
  previous: Employee[],
  next: Employee[],
): Employee[] => {
  if (previous.length === 0) return next

  const previousById = new Map(previous.map((employee) => [employee.id, employee]))
  let hasChanges = next.length !== previous.length

  const merged = next.map((nextEmployee, index) => {
    const previousEmployee = previousById.get(nextEmployee.id)

    if (previousEmployee && areEmployeesEqual(previousEmployee, nextEmployee)) {
      if (!hasChanges && previous[index] !== previousEmployee) {
        hasChanges = true
      }
      return previousEmployee
    }

    hasChanges = true
    return nextEmployee
  })

  return hasChanges ? merged : previous
}
