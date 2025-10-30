# API

## Overview

AE Invoicing OS provides a RESTful API for managing invoices, clients, projects, expenses, time tracking, accounting, and automations. All API endpoints are built using Next.js API Routes and follow REST conventions.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API uses session-based authentication. Include authentication cookies in requests.

**Future Enhancement**: JWT token authentication for API access.

```typescript
// Example authenticated request
const response = await fetch('/api/invoices', {
  headers: {
    'Content-Type': 'application/json',
    // Authentication headers will be added
  },
  credentials: 'include', // Include cookies
})
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... } // Optional additional details
}
```

## Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Rate Limiting

**Current**: No rate limiting (development)
**Future**: 100 requests per minute per user

## API Endpoints

---

## Invoices

### List Invoices

Get a list of all invoices.

**Endpoint**: `GET /api/invoices`

**Query Parameters**:
- `status` (optional): Filter by status (`draft`, `sent`, `paid`, `overdue`, `cancelled`)
- `clientId` (optional): Filter by client ID
- `startDate` (optional): Filter by issue date (ISO 8601)
- `endDate` (optional): Filter by issue date (ISO 8601)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10, max: 100)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/invoices?status=paid&page=1&limit=10"
```

**Example Response**:
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-2025-001",
      "clientId": "client_456",
      "clientName": "Acme Corp",
      "clientEmail": "billing@acme.com",
      "issueDate": "2025-01-15T00:00:00Z",
      "dueDate": "2025-02-15T00:00:00Z",
      "subtotal": 5000.00,
      "taxAmount": 450.00,
      "total": 5450.00,
      "status": "paid",
      "paidDate": "2025-02-10T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Create Invoice

Create a new invoice.

**Endpoint**: `POST /api/invoices`

**Request Body**:
```json
{
  "clientId": "client_456",
  "billFrom": {
    "name": "Your Business",
    "address": "123 Business St, City, State 12345",
    "email": "billing@yourbusiness.com",
    "phone": "+1-555-0100"
  },
  "billTo": {
    "name": "Acme Corp",
    "address": "456 Client Ave, City, State 67890",
    "email": "billing@acme.com"
  },
  "issueDate": "2025-01-15",
  "dueDate": "2025-02-15",
  "lineItems": [
    {
      "description": "Website Development",
      "quantity": 1,
      "rate": 5000.00,
      "taxable": true
    },
    {
      "description": "Hosting (Annual)",
      "quantity": 1,
      "rate": 500.00,
      "taxable": false
    }
  ],
  "taxRate": 9.0,
  "discountAmount": 0,
  "notes": "Thank you for your business!",
  "terms": "Payment due within 30 days",
  "template": "modern"
}
```

**Example Response**:
```json
{
  "id": "inv_123",
  "invoiceNumber": "INV-2025-001",
  "status": "draft",
  "subtotal": 5500.00,
  "taxAmount": 450.00,
  "total": 5950.00,
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Get Invoice

Get details of a specific invoice.

**Endpoint**: `GET /api/invoices/[id]`

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/invoices/inv_123"
```

**Example Response**:
```json
{
  "id": "inv_123",
  "invoiceNumber": "INV-2025-001",
  "clientId": "client_456",
  "clientName": "Acme Corp",
  "clientEmail": "billing@acme.com",
  "billFrom": {
    "name": "Your Business",
    "address": "123 Business St, City, State 12345",
    "email": "billing@yourbusiness.com",
    "phone": "+1-555-0100"
  },
  "billTo": {
    "name": "Acme Corp",
    "address": "456 Client Ave, City, State 67890",
    "email": "billing@acme.com"
  },
  "issueDate": "2025-01-15T00:00:00Z",
  "dueDate": "2025-02-15T00:00:00Z",
  "lineItems": [
    {
      "id": "item_1",
      "description": "Website Development",
      "quantity": 1,
      "rate": 5000.00,
      "amount": 5000.00,
      "taxable": true
    }
  ],
  "subtotal": 5000.00,
  "taxRate": 9.0,
  "taxAmount": 450.00,
  "discountAmount": 0,
  "total": 5450.00,
  "status": "sent",
  "emailStatus": "delivered",
  "notes": "Thank you for your business!",
  "terms": "Payment due within 30 days",
  "paymentLink": "https://pay.stripe.com/...",
  "template": "modern",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

### Update Invoice

Update an existing invoice.

**Endpoint**: `PUT /api/invoices/[id]`

**Request Body**: Same as Create Invoice (partial updates supported)

**Example Request**:
```bash
curl -X PUT "http://localhost:3000/api/invoices/inv_123" \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'
```

### Delete Invoice

Delete an invoice.

**Endpoint**: `DELETE /api/invoices/[id]`

**Example Request**:
```bash
curl -X DELETE "http://localhost:3000/api/invoices/inv_123"
```

**Example Response**:
```json
{
  "message": "Invoice deleted successfully"
}
```

### Generate Invoice PDF

Generate a PDF for an invoice.

**Endpoint**: `GET /api/invoices/[id]/pdf`

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/invoices/inv_123/pdf" > invoice.pdf
```

**Response**: PDF file (application/pdf)

### Send Invoice

Send an invoice via email.

**Endpoint**: `POST /api/invoices/[id]/send`

**Request Body**:
```json
{
  "to": "billing@acme.com",
  "cc": ["manager@acme.com"],
  "subject": "Invoice INV-2025-001",
  "message": "Please find attached invoice for services rendered.",
  "attachPdf": true
}
```

**Example Response**:
```json
{
  "message": "Invoice sent successfully",
  "emailId": "email_789"
}
```

---

## Clients

### List Clients

Get a list of all clients.

**Endpoint**: `GET /api/clients`

**Query Parameters**:
- `status` (optional): Filter by status (`active`, `inactive`, `archived`)
- `search` (optional): Search by name or email
- `page` (optional): Page number
- `limit` (optional): Results per page

**Example Response**:
```json
{
  "clients": [
    {
      "id": "client_456",
      "name": "Acme Corp",
      "email": "billing@acme.com",
      "phone": "+1-555-0200",
      "status": "active",
      "lifetimeBilled": 25000.00,
      "lifetimePaid": 23000.00,
      "outstanding": 2000.00,
      "health": "good"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Create Client

Create a new client.

**Endpoint**: `POST /api/clients`

**Request Body**:
```json
{
  "name": "Acme Corp",
  "email": "billing@acme.com",
  "phone": "+1-555-0200",
  "address": "456 Client Ave",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "USA",
  "taxId": "12-3456789",
  "paymentTerms": "net_30",
  "notes": "Preferred client"
}
```

### Get Client

Get details of a specific client.

**Endpoint**: `GET /api/clients/[id]`

### Update Client

Update an existing client.

**Endpoint**: `PUT /api/clients/[id]`

### Delete Client

Delete a client.

**Endpoint**: `DELETE /api/clients/[id]`

---

## Projects

### List Projects

Get a list of all projects.

**Endpoint**: `GET /api/projects`

**Query Parameters**:
- `status` (optional): Filter by status
- `clientId` (optional): Filter by client
- `page`, `limit`: Pagination

**Example Response**:
```json
{
  "projects": [
    {
      "id": "proj_789",
      "name": "Website Redesign",
      "clientId": "client_456",
      "status": "in_progress",
      "startDate": "2025-01-01T00:00:00Z",
      "dueDate": "2025-03-31T00:00:00Z",
      "budget": 15000.00,
      "spent": 7500.00,
      "progress": 50,
      "timeLogged": 3600
    }
  ]
}
```

### Create Project

**Endpoint**: `POST /api/projects`

**Request Body**:
```json
{
  "name": "Website Redesign",
  "description": "Complete overhaul of company website",
  "clientId": "client_456",
  "status": "planning",
  "startDate": "2025-01-01",
  "dueDate": "2025-03-31",
  "budget": 15000.00
}
```

### Get Project

**Endpoint**: `GET /api/projects/[id]`

### Update Project

**Endpoint**: `PUT /api/projects/[id]`

### Delete Project

**Endpoint**: `DELETE /api/projects/[id]`

---

## Time Tracking

### List Time Entries

Get a list of time entries.

**Endpoint**: `GET /api/time-tracking`

**Query Parameters**:
- `projectId` (optional): Filter by project
- `startDate`, `endDate`: Date range filter
- `billable` (optional): Filter by billable status
- `page`, `limit`: Pagination

**Example Response**:
```json
{
  "entries": [
    {
      "id": "time_001",
      "projectId": "proj_789",
      "description": "Frontend development",
      "startTime": "2025-01-15T09:00:00Z",
      "endTime": "2025-01-15T13:00:00Z",
      "duration": 240,
      "billable": true,
      "hourlyRate": 100.00,
      "invoiced": false
    }
  ]
}
```

### Create Time Entry

**Endpoint**: `POST /api/time-tracking`

**Request Body**:
```json
{
  "projectId": "proj_789",
  "description": "Frontend development",
  "startTime": "2025-01-15T09:00:00Z",
  "endTime": "2025-01-15T13:00:00Z",
  "billable": true,
  "hourlyRate": 100.00
}
```

### Update Time Entry

**Endpoint**: `PUT /api/time-tracking/[id]`

### Delete Time Entry

**Endpoint**: `DELETE /api/time-tracking/[id]`

---

## Expenses

### List Expenses

Get a list of expenses.

**Endpoint**: `GET /api/expenses`

**Query Parameters**:
- `category` (optional): Filter by category
- `startDate`, `endDate`: Date range
- `deductible` (optional): Filter by tax deductibility
- `page`, `limit`: Pagination

**Example Response**:
```json
{
  "expenses": [
    {
      "id": "exp_001",
      "description": "Adobe Creative Cloud",
      "amount": 54.99,
      "category": "software",
      "date": "2025-01-15T00:00:00Z",
      "deductible": true,
      "billable": false,
      "receipt": "https://storage.example.com/receipt.pdf"
    }
  ]
}
```

### Create Expense

**Endpoint**: `POST /api/expenses`

**Request Body**:
```json
{
  "description": "Adobe Creative Cloud",
  "amount": 54.99,
  "category": "software",
  "date": "2025-01-15",
  "deductible": true,
  "billable": false,
  "receipt": "https://storage.example.com/receipt.pdf",
  "notes": "Monthly subscription"
}
```

### Update Expense

**Endpoint**: `PUT /api/expenses/[id]`

### Delete Expense

**Endpoint**: `DELETE /api/expenses/[id]`

---

## Accounting

### Get Accounting Overview

Get profit/loss statement and financial overview.

**Endpoint**: `GET /api/accounting`

**Query Parameters**:
- `startDate`: Period start date (ISO 8601)
- `endDate`: Period end date (ISO 8601)

**Example Response**:
```json
{
  "period": {
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-12-31T23:59:59Z"
  },
  "revenue": {
    "invoiced": 125000.00,
    "received": 118000.00,
    "outstanding": 7000.00
  },
  "expenses": {
    "total": 35000.00,
    "byCategory": {
      "software": 5000.00,
      "equipment": 10000.00,
      "marketing": 8000.00,
      "office": 12000.00
    }
  },
  "profit": 83000.00,
  "profitMargin": 66.4
}
```

### Generate Tax Document

Generate tax documentation for a given year.

**Endpoint**: `GET /api/accounting/tax-document`

**Query Parameters**:
- `year`: Tax year (e.g., 2025)

**Example Response**:
```json
{
  "id": "tax_2025",
  "year": 2025,
  "totalRevenue": 125000.00,
  "totalExpenses": 35000.00,
  "deductions": [
    {
      "category": "software",
      "amount": 5000.00,
      "description": "Business software subscriptions"
    }
  ],
  "estimatedTax": 22500.00,
  "quarterlyBreakdown": [
    {
      "quarter": 1,
      "revenue": 28000.00,
      "expenses": 8000.00,
      "estimatedTax": 5000.00
    }
  ],
  "generatedAt": "2025-01-15T10:00:00Z"
}
```

---

## Automations

### List Automations

Get a list of all automations.

**Endpoint**: `GET /api/automations`

**Query Parameters**:
- `enabled` (optional): Filter by enabled status

**Example Response**:
```json
{
  "automations": [
    {
      "id": "auto_001",
      "name": "Send Payment Reminder",
      "description": "Send reminder 3 days before invoice due date",
      "enabled": true,
      "trigger": {
        "type": "scheduled",
        "params": { "days_before_due": 3 }
      },
      "actions": [
        {
          "type": "send_email",
          "params": {
            "template": "payment_reminder"
          }
        }
      ]
    }
  ]
}
```

### Create Automation

**Endpoint**: `POST /api/automations`

**Request Body**:
```json
{
  "name": "Thank You Email on Payment",
  "description": "Send thank you email when invoice is paid",
  "enabled": true,
  "trigger": {
    "type": "invoice_paid"
  },
  "actions": [
    {
      "type": "send_email",
      "params": {
        "template": "thank_you",
        "to": "{{invoice.clientEmail}}"
      }
    },
    {
      "type": "update_notion",
      "params": {
        "database": "clients",
        "field": "last_payment_date"
      }
    }
  ],
  "conditions": [
    {
      "field": "invoice.total",
      "operator": "greater_than",
      "value": 1000
    }
  ]
}
```

### Get Automation

**Endpoint**: `GET /api/automations/[id]`

### Update Automation

**Endpoint**: `PUT /api/automations/[id]`

### Delete Automation

**Endpoint**: `DELETE /api/automations/[id]`

---

## Webhooks

### Stripe Webhook

Receive Stripe payment events.

**Endpoint**: `POST /api/webhook/stripe`

**Headers**:
- `stripe-signature`: Webhook signature for verification

**Events Handled**:
- `payment_intent.succeeded`
- `payment_intent.failed`
- `invoice.payment_succeeded`
- `customer.subscription.updated`

### Resend Webhook

Receive Resend email events.

**Endpoint**: `POST /api/webhook/resend`

**Events Handled**:
- `email.sent`
- `email.delivered`
- `email.opened`
- `email.bounced`

### Notion Webhook

Receive Notion database updates (if configured).

**Endpoint**: `POST /api/webhook/notion`

---

## Error Handling

### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "amount": "Must be a positive number"
  }
}
```

### Not Found

```json
{
  "success": false,
  "error": "Invoice not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

### Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Create invoice
const invoice = await api.post('/invoices', {
  clientId: 'client_456',
  lineItems: [...],
  // ...
})

// Get invoices
const { data } = await api.get('/invoices', {
  params: {
    status: 'paid',
    page: 1,
  },
})
```

### Fetch API

```javascript
const response = await fetch('http://localhost:3000/api/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    clientId: 'client_456',
    lineItems: [...],
  }),
})

const invoice = await response.json()
```

## Best Practices

1. **Always validate input**: Use Zod or similar for request validation
2. **Handle errors gracefully**: Provide meaningful error messages
3. **Use appropriate HTTP methods**: GET, POST, PUT, DELETE
4. **Implement pagination**: For list endpoints
5. **Cache responses**: When appropriate
6. **Rate limit**: Implement in production
7. **Version API**: Consider versioning for breaking changes
8. **Document changes**: Keep API docs updated
9. **Test thoroughly**: Unit and integration tests
10. **Monitor performance**: Track API metrics

## Testing

### Using curl

```bash
# Create an invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Get invoices
curl -X GET "http://localhost:3000/api/invoices?status=paid"

# Update invoice
curl -X PUT http://localhost:3000/api/invoices/inv_123 \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'
```

### Using Postman

1. Import the API collection
2. Set base URL to `http://localhost:3000/api`
3. Configure authentication
4. Test endpoints

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- Invoice, client, project, expense, time tracking endpoints
- Accounting and automation endpoints
- Webhook support for Stripe, Resend, Notion
