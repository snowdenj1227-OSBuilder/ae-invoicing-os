export interface ProfitLossStatement {
  period: {
    start: Date
    end: Date
  }
  revenue: {
    invoiced: number
    received: number
    outstanding: number
  }
  expenses: {
    total: number
    byCategory: Record<string, number>
  }
  profit: number
  profitMargin: number
}

export interface TaxDocument {
  id: string
  year: number
  totalRevenue: number
  totalExpenses: number
  deductions: TaxDeduction[]
  estimatedTax: number
  quarterlyBreakdown: QuarterlyTax[]
  generatedAt: Date
}

export interface TaxDeduction {
  category: string
  amount: number
  description?: string
}

export interface QuarterlyTax {
  quarter: number
  revenue: number
  expenses: number
  estimatedTax: number
}
