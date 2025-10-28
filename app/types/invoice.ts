export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  taxable: boolean
}

export interface Invoice {
  id: string
  notionId?: string
  invoiceNumber: string
  clientId: string
  clientName: string
  clientEmail: string
  billFrom: {
    name: string
    address: string
    email: string
    phone: string
  }
  billTo: {
    name: string
    address: string
    email: string
  }
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  lineItems: LineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  total: number
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled'
  emailStatus: 'not_sent' | 'sent' | 'delivered' | 'opened' | 'bounced'
  notes?: string
  terms?: string
  paymentLink?: string
  paymentMethod?: string
  recurring?: {
    enabled: boolean
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
    nextDate?: Date
    endDate?: Date
  }
  template: string
  branding: {
    logo?: string
    primaryColor: string
    accentColor: string
    fontFamily: string
  }
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceTemplate {
  id: string
  name: string
  description: string
  preview: string
  layout: 'modern' | 'minimal' | 'corporate' | 'creative'
  colors: {
    primary: string
    accent: string
    background: string
    text: string
  }
}

export interface RecurringInvoice {
  id: string
  invoiceId: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
  nextDate: Date
  endDate?: Date
  active: boolean
  createdAt: Date
}
