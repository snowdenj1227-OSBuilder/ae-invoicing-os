export interface Expense {
  id: string
  notionId?: string
  amount: number
  currency: string
  category: string
  description: string
  date: Date
  merchant?: string
  receipt?: {
    url: string
    text: string
  }
  recurring: boolean
  frequenc?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  deductible: boolean
  taxCategory?: string
  project?: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseCategory {
  id: string
  name: string
  description?: string
  icon: string
  color: string
}
