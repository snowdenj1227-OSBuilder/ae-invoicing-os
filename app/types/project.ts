export interface Project {
  id: string
  notionId?: string
  name: string
  description?: string
  clientId: string
  status: 'planning' | 'in_progress' | 'in_review' | 'completed' | 'on_hold'
  startDate: Date
  dueDate?: Date
  completedDate?: Date
  budget?: number
  spent: number
  tasks: ProjectTask[]
  milestones: Milestone[]
  timeLogged: number
  progress: number
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface ProjectTask {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: Date
  timeEstimate?: number
  timeLogged: number
}

export interface Milestone {
  id: string
  projectId: string
  name: string
  dueDate: Date
  completedDate?: Date
  invoiceAmount?: number
  status: 'pending' | 'completed'
}
