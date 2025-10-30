# Architecture

## System Overview

AE Invoicing OS is a premium freelancer operating system built with a modern, scalable architecture. The system combines Next.js for the frontend application with Cloudflare Workers for edge computing, providing a fast, reliable invoicing and business management platform.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer (Next.js)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (Next.js 14)                  │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │   │
│  │  │  Auth  │  │Dashboard│ │ Portal │  │  API   │     │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Component Layer                          │   │
│  │  • UI Components  • Forms  • Charts  • Templates     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         State Management (Zustand)                    │   │
│  │  • Auth  • Invoices  • Clients  • UI  • Automation   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Edge Computing Layer                     │
│              (Cloudflare Workers - Optional)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Request Routing    • API Middleware                │   │
│  │  • Authentication     • Rate Limiting                 │   │
│  │  • Caching           • Service Integration            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    Data Layer            │  │  External Services       │
│                          │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐ │
│  │  PostgreSQL/MySQL  │  │  │  │   Notion API       │ │
│  │    (Prisma ORM)    │  │  │  │   (CRM & Data)     │ │
│  └────────────────────┘  │  │  └────────────────────┘ │
│                          │  │  ┌────────────────────┐ │
│  ┌────────────────────┐  │  │  │   Stripe API       │ │
│  │  File Storage      │  │  │  │   (Payments)       │ │
│  │  (S3/Cloudflare)   │  │  │  └────────────────────┘ │
│  └────────────────────┘  │  │  ┌────────────────────┐ │
│                          │  │  │   Resend API       │ │
│                          │  │  │   (Email)          │ │
│                          │  │  └────────────────────┘ │
└──────────────────────────┘  └──────────────────────────┘
```

## Core Components

### 1. Next.js Application

**Purpose**: Main application framework handling UI, routing, and server-side logic.

**Key Features:**
- App Router for file-based routing
- Server and Client Components
- API Routes for backend endpoints
- Optimized image handling
- Built-in TypeScript support

**Directory Structure:**
```
app/
├── (auth)/              # Authentication pages (login, signup)
├── (dashboard)/         # Main application dashboard
│   ├── dashboard/       # Overview and quick actions
│   ├── invoices/        # Invoice management
│   ├── clients/         # Client management
│   ├── projects/        # Project tracking
│   ├── time-tracking/   # Time tracking
│   ├── expenses/        # Expense logging
│   ├── accounting/      # Accounting and taxes
│   ├── automation/      # Workflow automation
│   ├── reports/         # Reports and analytics
│   └── settings/        # User settings
├── (portal)/            # Client-facing portal
└── api/                 # API endpoints
```

### 2. Component Library

**Location**: `app/components/`

**Organization:**
- **Feature-based folders**: Each feature has its component folder
- **Shared components**: Common UI elements
- **Layout components**: Page layouts and wrappers

**Component Types:**
- **UI Components**: Buttons, cards, modals, forms
- **Feature Components**: Invoice forms, client cards, dashboards
- **Chart Components**: Data visualization with Recharts
- **Template Components**: Invoice templates, email templates

### 3. State Management

**Technology**: Zustand

**Stores:**
```typescript
// authStore.ts - User authentication state
interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (credentials) => Promise<void>
  logout: () => void
}

// invoiceStore.ts - Invoice data and operations
interface InvoiceStore {
  invoices: Invoice[]
  filters: InvoiceFilters
  fetchInvoices: () => Promise<void>
  createInvoice: (data) => Promise<Invoice>
  updateInvoice: (id, data) => Promise<void>
}

// clientStore.ts - Client management
interface ClientStore {
  clients: Client[]
  selectedClient: Client | null
  fetchClients: () => Promise<void>
  addClient: (data) => Promise<Client>
}

// automationStore.ts - Automation rules
interface AutomationStore {
  automations: Automation[]
  executions: AutomationExecution[]
  createAutomation: (data) => Promise<Automation>
  executeAutomation: (id) => Promise<void>
}

// uiStore.ts - UI state
interface UIStore {
  sidebarOpen: boolean
  modals: Record<string, boolean>
  notifications: Notification[]
  toggleSidebar: () => void
  showModal: (id) => void
}
```

### 4. API Layer

**Location**: `app/api/`

**Endpoints:**

**Invoices:**
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice
- `GET /api/invoices/[id]/pdf` - Generate PDF
- `POST /api/invoices/[id]/send` - Send invoice via email

**Clients:**
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client details
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

**Projects:**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project

**Time Tracking:**
- `GET /api/time-tracking` - Get time entries
- `POST /api/time-tracking` - Log time entry
- `PUT /api/time-tracking/[id]` - Update time entry

**Expenses:**
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/[id]` - Update expense

**Accounting:**
- `GET /api/accounting` - Get accounting overview
- `GET /api/accounting/tax-document` - Generate tax document

**Automations:**
- `GET /api/automations` - List automations
- `POST /api/automations` - Create automation
- `PUT /api/automations/[id]` - Update automation
- `POST /api/automations/[id]/execute` - Execute automation

**Webhooks:**
- `POST /api/webhook/stripe` - Stripe webhooks
- `POST /api/webhook/resend` - Resend webhooks
- `POST /api/webhook/notion` - Notion webhooks

### 5. Cloudflare Worker (Optional Edge Layer)

**Purpose**: Edge computing for improved performance and global distribution.

**Location**: `worker/src/`

**Responsibilities:**
- Request routing and load balancing
- API middleware and authentication
- Rate limiting and security
- Caching strategies
- Integration with external services

**Structure:**
```
worker/src/
├── index.ts              # Main worker entry point
├── handlers/             # Request handlers
│   ├── invoices.ts
│   ├── clients.ts
│   ├── projects.ts
│   ├── time-tracking.ts
│   ├── expenses.ts
│   ├── accounting.ts
│   ├── automations.ts
│   └── webhooks.ts
├── middleware/           # Middleware functions
│   ├── auth.ts          # Authentication
│   ├── cors.ts          # CORS handling
│   └── error-handler.ts # Error handling
├── services/            # Service integrations
│   ├── notion-service.ts
│   ├── stripe-service.ts
│   ├── resend-service.ts
│   ├── pdf-service.ts
│   ├── ocr-service.ts
│   └── automation-engine.ts
└── utils/               # Utility functions
    ├── validators.ts
    ├── formatters.ts
    └── calculations.ts
```

## Data Flow

### Invoice Creation Flow

```
User Input (Form)
      │
      ▼
React Hook Form + Zod Validation
      │
      ▼
Form Submit Handler
      │
      ▼
Zustand Store Action (createInvoice)
      │
      ▼
API Client (axios)
      │
      ▼
POST /api/invoices
      │
      ├──▶ Validate Request (Zod)
      │
      ├──▶ Process Business Logic
      │
      ├──▶ Save to Database (Prisma)
      │
      ├──▶ Sync to Notion (Optional)
      │
      ▼
Return Invoice Object
      │
      ▼
Update Zustand Store
      │
      ▼
UI Update (React Re-render)
      │
      ▼
Show Success Notification
```

### Payment Webhook Flow

```
Stripe Payment Event
      │
      ▼
POST /api/webhook/stripe
      │
      ├──▶ Verify Webhook Signature
      │
      ├──▶ Parse Event Data
      │
      ├──▶ Find Related Invoice
      │
      ├──▶ Update Invoice Status
      │
      ├──▶ Update Database
      │
      ├──▶ Sync to Notion
      │
      ├──▶ Trigger Automations
      │     │
      │     ├──▶ Send Thank You Email
      │     │
      │     └──▶ Update Client Stats
      │
      ▼
Return 200 OK
```

## Integration Architecture

### Notion Integration

**Purpose**: CRM and data synchronization

**Features:**
- Two-way sync with Notion databases
- Invoice, client, and project management
- Custom database properties
- Automated updates via webhooks

**Implementation:**
```typescript
// lib/notion.ts
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function syncInvoiceToNotion(invoice: Invoice) {
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_INVOICES_DB },
    properties: {
      'Invoice Number': { title: [{ text: { content: invoice.invoiceNumber } }] },
      'Client': { relation: [{ id: invoice.clientNotionId }] },
      'Amount': { number: invoice.total },
      'Status': { select: { name: invoice.status } },
      'Due Date': { date: { start: invoice.dueDate.toISOString() } },
    }
  })
}
```

### Stripe Integration

**Purpose**: Payment processing

**Features:**
- Secure payment links
- Subscription management
- Webhook event handling
- Customer management

**Implementation:**
```typescript
// lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createPaymentLink(invoice: Invoice) {
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Invoice ${invoice.invoiceNumber}` },
        unit_amount: Math.round(invoice.total * 100),
      },
      quantity: 1,
    }],
    metadata: { invoiceId: invoice.id },
  })
  
  return paymentLink.url
}
```

### Resend Integration

**Purpose**: Transactional email service

**Features:**
- Invoice delivery
- Payment notifications
- Reminder emails
- Custom templates

**Implementation:**
```typescript
// lib/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceEmail(invoice: Invoice) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: invoice.clientEmail,
    subject: `Invoice ${invoice.invoiceNumber}`,
    html: generateInvoiceEmailHTML(invoice),
    attachments: [
      {
        filename: `invoice-${invoice.invoiceNumber}.pdf`,
        content: await generateInvoicePDF(invoice),
      }
    ]
  })
}
```

## Security Architecture

### Authentication

- Session-based authentication
- Secure password hashing
- JWT tokens for API authentication
- Role-based access control (RBAC)

### API Security

- CORS configuration
- Rate limiting
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection
- CSRF tokens

### Data Security

- Environment variable management
- Encrypted database connections
- Secure webhook signature verification
- API key rotation

## Scalability Considerations

### Performance Optimization

1. **Server-Side Rendering**: Critical pages rendered on server
2. **Static Generation**: Marketing pages pre-generated
3. **Image Optimization**: Next.js Image component with CDN
4. **Code Splitting**: Dynamic imports for large components
5. **Database Indexing**: Optimized queries with proper indexes
6. **Edge Caching**: Cloudflare Workers for global distribution

### Horizontal Scaling

- Stateless API design
- Database connection pooling
- Redis for session storage (future enhancement)
- CDN for static assets
- Load balancing ready

## Monitoring and Logging

### Application Monitoring

- Error tracking (Sentry integration ready)
- Performance monitoring
- API response times
- Database query performance

### Logging Strategy

```typescript
// lib/logger.ts
export function logError(error: Error, context: any) {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context,
  })
  
  // Send to monitoring service in production
}
```

## Future Architecture Enhancements

1. **Microservices**: Split into focused services
2. **Message Queue**: RabbitMQ/Redis for async tasks
3. **GraphQL API**: Alternative to REST
4. **Mobile App**: React Native or Flutter
5. **Real-time Features**: WebSocket support
6. **Advanced Analytics**: Data warehouse integration
7. **Multi-tenancy**: Support for agencies
8. **AI Integration**: Smart automation and insights
