export interface Automation {
  id: string
  notionId?: string
  name: string
  description?: string
  enabled: boolean
  trigger: AutomationTrigger
  actions: AutomationAction[]
  conditions?: AutomationCondition[]
  history?: AutomationExecution[]
  createdAt: Date
  updatedAt: Date
}

export interface AutomationTrigger {
  type:
    | 'invoice_created'
    | 'invoice_sent'
    | 'invoice_paid'
    | 'invoice_overdue'
    | 'payment_received'
    | 'client_added'
    | 'expense_logged'
    | 'scheduled'
  params?: Record<string, any>
}

export interface AutomationAction {
  id: string
  type:
    | 'send_email'
    | 'send_notification'
    | 'update_notion'
    | 'create_task'
    | 'update_invoice'
    | 'webhook'
  params: Record<string, any>
}

export interface AutomationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: any
}

export interface AutomationExecution {
  id: string
  automationId: string
  status: 'executed' | 'failed' | 'skipped'
  triggeredAt: Date
  completedAt?: Date
  error?: string
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  icon: string
  trigger: AutomationTrigger
  actions: AutomationAction[]
}
