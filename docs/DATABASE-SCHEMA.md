# Database Schema

## Overview

AE Invoicing OS uses a relational database (PostgreSQL or MySQL) managed through Prisma ORM. The schema is designed for flexibility, scalability, and data integrity.

## Schema Design Principles

- **Normalization**: Minimize data redundancy
- **Relationships**: Clear foreign key relationships
- **Indexes**: Optimized for common queries
- **Timestamps**: Track creation and modification
- **Soft Deletes**: Preserve data integrity (optional)

## Core Entities

### Users

Stores user account information and authentication details.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String    // Hashed
  role          Role      @default(USER)
  emailVerified DateTime?
  image         String?
  
  // Business Information
  businessName  String?
  businessEmail String?
  businessPhone String?
  businessAddress String?
  taxId         String?
  
  // Settings
  settings      Json?     // User preferences
  
  // Relations
  invoices      Invoice[]
  clients       Client[]
  projects      Project[]
  expenses      Expense[]
  timeEntries   TimeEntry[]
  automations   Automation[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([email])
}

enum Role {
  USER
  ADMIN
}
```

### Clients

Stores client/customer information.

```prisma
model Client {
  id              String    @id @default(cuid())
  userId          String
  notionId        String?   @unique
  
  // Basic Information
  name            String
  email           String
  phone           String?
  
  // Address
  address         String?
  city            String?
  state           String?
  zipCode         String?
  country         String?
  
  // Business Details
  taxId           String?
  website         String?
  
  // Settings
  status          ClientStatus @default(ACTIVE)
  paymentTerms    PaymentTerms @default(NET_30)
  
  // Metrics
  lifetimeBilled  Decimal   @default(0) @db.Decimal(12, 2)
  lifetimePaid    Decimal   @default(0) @db.Decimal(12, 2)
  outstanding     Decimal   @default(0) @db.Decimal(12, 2)
  avgPaymentDays  Int       @default(0)
  health          ClientHealth @default(GOOD)
  
  // Additional Data
  notes           String?   @db.Text
  metadata        Json?
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  invoices        Invoice[]
  projects        Project[]
  contacts        ClientContact[]
  notes           ClientNote[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([email])
  @@index([status])
}

enum ClientStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum PaymentTerms {
  DUE_ON_RECEIPT
  NET_15
  NET_30
  NET_60
  NET_90
}

enum ClientHealth {
  EXCELLENT
  GOOD
  WARNING
  AT_RISK
}
```

### Client Contacts

Sub-contacts for a client organization.

```prisma
model ClientContact {
  id          String    @id @default(cuid())
  clientId    String
  
  name        String
  email       String
  phone       String?
  role        String?
  isPrimary   Boolean   @default(false)
  
  // Relations
  client      Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([clientId])
}
```

### Client Notes

Notes and communication history with clients.

```prisma
model ClientNote {
  id          String    @id @default(cuid())
  clientId    String
  
  content     String    @db.Text
  type        NoteType  @default(GENERAL)
  
  // Relations
  client      Client    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([clientId])
}

enum NoteType {
  GENERAL
  FOLLOW_UP
  ISSUE
  COMPLIMENT
}
```

### Invoices

Core invoice entity with all billing information.

```prisma
model Invoice {
  id              String    @id @default(cuid())
  userId          String
  clientId        String
  notionId        String?   @unique
  
  // Invoice Details
  invoiceNumber   String    @unique
  
  // Billing Information
  billFrom        Json      // { name, address, email, phone }
  billTo          Json      // { name, address, email }
  
  // Dates
  issueDate       DateTime
  dueDate         DateTime
  paidDate        DateTime?
  
  // Financial
  lineItems       Json      // Array of line items
  subtotal        Decimal   @db.Decimal(12, 2)
  taxRate         Decimal   @default(0) @db.Decimal(5, 2)
  taxAmount       Decimal   @default(0) @db.Decimal(12, 2)
  discountAmount  Decimal   @default(0) @db.Decimal(12, 2)
  total           Decimal   @db.Decimal(12, 2)
  
  // Status
  status          InvoiceStatus @default(DRAFT)
  emailStatus     EmailStatus @default(NOT_SENT)
  
  // Content
  notes           String?   @db.Text
  terms           String?   @db.Text
  
  // Payment
  paymentLink     String?
  paymentMethod   String?
  
  // Recurring
  recurring       Json?     // { enabled, frequency, nextDate, endDate }
  
  // Branding
  template        String    @default("modern")
  branding        Json?     // { logo, primaryColor, accentColor, fontFamily }
  
  // Metadata
  metadata        Json?
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  client          Client    @relation(fields: [clientId], references: [id], onDelete: Restrict)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([clientId])
  @@index([invoiceNumber])
  @@index([status])
  @@index([dueDate])
}

enum InvoiceStatus {
  DRAFT
  SENT
  VIEWED
  PAID
  OVERDUE
  CANCELLED
}

enum EmailStatus {
  NOT_SENT
  SENT
  DELIVERED
  OPENED
  BOUNCED
}
```

### Projects

Project management and tracking.

```prisma
model Project {
  id              String    @id @default(cuid())
  userId          String
  clientId        String
  notionId        String?   @unique
  
  // Project Details
  name            String
  description     String?   @db.Text
  
  // Status
  status          ProjectStatus @default(PLANNING)
  
  // Dates
  startDate       DateTime
  dueDate         DateTime?
  completedDate   DateTime?
  
  // Financial
  budget          Decimal?  @db.Decimal(12, 2)
  spent           Decimal   @default(0) @db.Decimal(12, 2)
  
  // Progress
  progress        Int       @default(0)  // 0-100
  timeLogged      Int       @default(0)  // minutes
  
  // Additional Data
  metadata        Json?
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  client          Client    @relation(fields: [clientId], references: [id], onDelete: Restrict)
  tasks           ProjectTask[]
  milestones      Milestone[]
  timeEntries     TimeEntry[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([clientId])
  @@index([status])
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
  ON_HOLD
}
```

### Project Tasks

Individual tasks within a project.

```prisma
model ProjectTask {
  id              String    @id @default(cuid())
  projectId       String
  
  // Task Details
  title           String
  description     String?   @db.Text
  
  // Status
  status          TaskStatus @default(TODO)
  priority        Priority  @default(MEDIUM)
  
  // Assignment
  assignee        String?
  
  // Timing
  dueDate         DateTime?
  timeEstimate    Int?      // minutes
  timeLogged      Int       @default(0) // minutes
  
  // Relations
  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([projectId])
  @@index([status])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

### Milestones

Project milestones and deliverables.

```prisma
model Milestone {
  id              String    @id @default(cuid())
  projectId       String
  
  name            String
  dueDate         DateTime
  completedDate   DateTime?
  invoiceAmount   Decimal?  @db.Decimal(12, 2)
  status          MilestoneStatus @default(PENDING)
  
  // Relations
  project         Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([projectId])
}

enum MilestoneStatus {
  PENDING
  COMPLETED
}
```

### Time Entries

Time tracking for billable and non-billable work.

```prisma
model TimeEntry {
  id              String    @id @default(cuid())
  userId          String
  projectId       String?
  
  // Time Details
  description     String
  startTime       DateTime
  endTime         DateTime?
  duration        Int       // minutes
  
  // Billing
  billable        Boolean   @default(true)
  hourlyRate      Decimal?  @db.Decimal(10, 2)
  
  // Status
  invoiced        Boolean   @default(false)
  invoiceId       String?
  
  // Additional Data
  metadata        Json?
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  project         Project?  @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([projectId])
  @@index([startTime])
}
```

### Expenses

Business expense tracking.

```prisma
model Expense {
  id              String    @id @default(cuid())
  userId          String
  
  // Expense Details
  description     String
  amount          Decimal   @db.Decimal(12, 2)
  category        String
  
  // Date
  date            DateTime
  
  // Receipt
  receipt         String?   // URL to receipt image
  
  // Tax
  deductible      Boolean   @default(true)
  
  // Reimbursement
  billable        Boolean   @default(false)
  clientId        String?
  invoiced        Boolean   @default(false)
  
  // Additional Data
  notes           String?   @db.Text
  metadata        Json?
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([category])
  @@index([date])
}
```

### Automations

Workflow automation rules.

```prisma
model Automation {
  id              String    @id @default(cuid())
  userId          String
  notionId        String?   @unique
  
  // Automation Details
  name            String
  description     String?   @db.Text
  enabled         Boolean   @default(true)
  
  // Configuration
  trigger         Json      // { type, params }
  actions         Json      // Array of actions
  conditions      Json?     // Array of conditions
  
  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  executions      AutomationExecution[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([enabled])
}
```

### Automation Executions

History of automation runs.

```prisma
model AutomationExecution {
  id              String    @id @default(cuid())
  automationId    String
  
  status          ExecutionStatus
  triggeredAt     DateTime  @default(now())
  completedAt     DateTime?
  error           String?   @db.Text
  
  // Relations
  automation      Automation @relation(fields: [automationId], references: [id], onDelete: Cascade)
  
  @@index([automationId])
  @@index([triggeredAt])
}

enum ExecutionStatus {
  EXECUTED
  FAILED
  SKIPPED
}
```

## Relationships Diagram

```
User
  ├─── Clients (1:N)
  │      ├─── ClientContacts (1:N)
  │      ├─── ClientNotes (1:N)
  │      ├─── Invoices (1:N)
  │      └─── Projects (1:N)
  │
  ├─── Invoices (1:N)
  │
  ├─── Projects (1:N)
  │      ├─── ProjectTasks (1:N)
  │      ├─── Milestones (1:N)
  │      └─── TimeEntries (1:N)
  │
  ├─── TimeEntries (1:N)
  │
  ├─── Expenses (1:N)
  │
  └─── Automations (1:N)
         └─── AutomationExecutions (1:N)
```

## Common Queries

### Get All Invoices for a Client

```typescript
const invoices = await prisma.invoice.findMany({
  where: {
    clientId: clientId,
  },
  include: {
    client: true,
  },
  orderBy: {
    issueDate: 'desc',
  },
})
```

### Get Overdue Invoices

```typescript
const overdueInvoices = await prisma.invoice.findMany({
  where: {
    status: {
      in: ['SENT', 'VIEWED'],
    },
    dueDate: {
      lt: new Date(),
    },
  },
  include: {
    client: true,
  },
})
```

### Get Monthly Revenue

```typescript
const startOfMonth = new Date(year, month, 1)
const endOfMonth = new Date(year, month + 1, 0)

const paidInvoices = await prisma.invoice.aggregate({
  where: {
    userId: userId,
    status: 'PAID',
    paidDate: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  _sum: {
    total: true,
  },
})
```

### Get Client Statistics

```typescript
const clientStats = await prisma.client.findUnique({
  where: { id: clientId },
  include: {
    invoices: {
      select: {
        total: true,
        status: true,
        paidDate: true,
      },
    },
    projects: {
      select: {
        spent: true,
      },
    },
  },
})
```

### Get Project Progress

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    tasks: {
      select: {
        status: true,
      },
    },
    milestones: {
      select: {
        status: true,
      },
    },
    timeEntries: {
      select: {
        duration: true,
      },
    },
  },
})
```

## Indexes and Performance

### Critical Indexes

```prisma
// User lookups
@@index([email])

// Invoice queries
@@index([userId])
@@index([clientId])
@@index([invoiceNumber])
@@index([status])
@@index([dueDate])

// Client queries
@@index([userId])
@@index([email])
@@index([status])

// Project queries
@@index([userId])
@@index([clientId])
@@index([status])

// Time tracking
@@index([userId])
@@index([projectId])
@@index([startTime])

// Expense tracking
@@index([userId])
@@index([category])
@@index([date])
```

### Query Optimization Tips

1. **Select Only Needed Fields**: Use `select` to limit returned data
2. **Use Includes Wisely**: Avoid deep nesting of relations
3. **Pagination**: Use `skip` and `take` for large result sets
4. **Caching**: Cache frequently accessed data
5. **Database Indexes**: Add indexes for commonly filtered fields

## Data Migration Strategy

### Initial Setup

```bash
# Create migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

### Schema Updates

```bash
# After modifying schema.prisma
npx prisma migrate dev --name descriptive_name

# Generate Prisma Client
npx prisma generate
```

### Data Seeding

```bash
# Run seed script
npm run seed
```

## Backup and Recovery

### Automated Backups

- Daily database backups
- Point-in-time recovery enabled
- 30-day retention policy
- Geo-redundant storage

### Manual Backup

```bash
# PostgreSQL
pg_dump -U username -d ae_invoicing > backup.sql

# MySQL
mysqldump -u username -p ae_invoicing > backup.sql
```

### Restore

```bash
# PostgreSQL
psql -U username -d ae_invoicing < backup.sql

# MySQL
mysql -u username -p ae_invoicing < backup.sql
```

## Security Considerations

1. **Encryption at Rest**: Enable database encryption
2. **Secure Connections**: Use SSL/TLS for database connections
3. **Access Control**: Limit database user permissions
4. **SQL Injection Prevention**: Prisma provides protection by default
5. **Data Sanitization**: Validate all inputs
6. **Audit Logging**: Track sensitive data access
