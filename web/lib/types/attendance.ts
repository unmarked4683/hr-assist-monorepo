export type RowStatus =
  | { type: 'ok' }
  | { type: 'absent' }
  | { type: 'leave'; label: string }
  | { type: 'future' }

export type ListAttendanceStatus = 'ok-list' | 'action-required'
