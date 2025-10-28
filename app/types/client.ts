export interface Client {
  id: string
  notionId?: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  taxId?: string
  status: 'active' | 'inactive' | 'archived'
  paymentTerms: 'net_30' | 'net_60' | 'net_90' | 'due_on_receipt'
  invoices?: string[]
  lifetimeBilled: number
  lifetimePaid: number
  outstanding: number
  averagePaymentDays: number
  health: 'excellent' | 'good' | 'warning' | 'at_risk'
  notes?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface ClientContact {
  id: string
  clientId: string
  name: string
  email: string
  phone?: string
  role?: string
  isPrimary: boolean
}

export interface ClientNote {
  id: string
  clientId: string
  content: string
  type: 'general' | 'follow_up' | 'issue' | 'compliment'
  createdAt: Date
  updatedAt: Date
}
