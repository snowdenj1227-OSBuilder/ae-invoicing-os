export interface TimeEntry {
  id: string
  notionId?: string
  projectId?: string
  clientId: string
  description: string
  startTime: Date
  endTime: Date
  duration: number
  billable: boolean
  hourlyRate?: number
  amount?: number
  status: 'draft' | 'submitted' | 'approved'
  invoiceId?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface Timesheet {
  id: string
  userId: string
  startDate: Date
  endDate: Date
  entries: TimeEntry[]
  totalHours: number
  totalBillable: number
  status: 'draft' | 'submitted' | 'approved'
  submittedAt?: Date
  approvedAt?: Date
}
