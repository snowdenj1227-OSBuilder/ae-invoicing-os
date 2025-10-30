# Development

## Development Workflow

### Getting Started

1. Follow the [SETUP.md](./SETUP.md) guide to install dependencies and configure your environment
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Project Structure

```
ae-invoicing-os/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Main dashboard routes
│   ├── (portal)/            # Client portal routes
│   ├── api/                 # API routes
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── store/               # Zustand state management
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── docs/                    # Documentation
├── prisma/                  # Database schema
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── worker/                  # Cloudflare Worker
│   └── src/                 # Worker source code
└── [config files]           # Configuration files
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Recharts**: Data visualization
- **Zustand**: State management

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Cloudflare Workers**: Edge computing for performance
- **Prisma**: Type-safe database ORM

### Integrations
- **Notion API**: Database and CRM integration
- **Stripe**: Payment processing
- **Resend**: Transactional email service

### UI Components
- **Heroicons**: Icon library
- **Lucide React**: Additional icons
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## Development Commands

### Main Application

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run type-check

# Database operations
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio
```

### Cloudflare Worker

```bash
# Local development
npm run worker:dev

# Build worker
npm run worker:build

# Deploy to Cloudflare
npm run worker:deploy
```

### Utility Scripts

```bash
# Setup Notion databases
npm run setup

# Seed database with sample data
npm run seed
```

## Coding Standards

### TypeScript

- Use strict mode
- Define explicit types for all function parameters and returns
- Avoid `any` type; use `unknown` or proper types
- Use interfaces for object shapes
- Use type aliases for unions and primitives

**Example:**
```typescript
interface Invoice {
  id: string
  amount: number
  status: 'draft' | 'sent' | 'paid'
}

export async function createInvoice(
  data: Omit<Invoice, 'id'>
): Promise<Invoice> {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused on single responsibility
- Use proper prop typing with TypeScript

**Example:**
```typescript
interface InvoiceCardProps {
  invoice: Invoice
  onUpdate: (id: string) => void
}

export function InvoiceCard({ invoice, onUpdate }: InvoiceCardProps) {
  // Component implementation
}
```

### File Organization

- One component per file
- Co-locate related files (component + styles + tests)
- Use index files for clean imports
- Keep utilities in `lib/` directory

### Naming Conventions

- **Components**: PascalCase (e.g., `InvoiceCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useInvoices.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase (e.g., `Invoice`, `Client`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_INVOICE_AMOUNT`)

## State Management

### Zustand Stores

The application uses Zustand for state management. Stores are located in `app/store/`:

- `authStore.ts`: Authentication state
- `invoiceStore.ts`: Invoice data and operations
- `clientStore.ts`: Client data management
- `automationStore.ts`: Automation rules and execution
- `uiStore.ts`: UI state (modals, notifications)

**Example Store:**
```typescript
import { create } from 'zustand'

interface InvoiceStore {
  invoices: Invoice[]
  selectedInvoice: Invoice | null
  setInvoices: (invoices: Invoice[]) => void
  selectInvoice: (id: string) => void
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  selectedInvoice: null,
  setInvoices: (invoices) => set({ invoices }),
  selectInvoice: (id) => set((state) => ({
    selectedInvoice: state.invoices.find(inv => inv.id === id)
  })),
}))
```

## API Development

### Creating New Endpoints

1. Create a new route file in `app/api/[resource]/route.ts`
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Add proper error handling
4. Use Zod for request validation
5. Return consistent response format

**Example API Route:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const invoiceSchema = z.object({
  clientId: z.string(),
  amount: z.number().positive(),
  dueDate: z.string().datetime(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = invoiceSchema.parse(body)
    
    // Create invoice logic
    const invoice = await createInvoice(validated)
    
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Database Development

### Schema Changes

1. Modify `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Update TypeScript types in `app/types/`
4. Update API endpoints as needed

### Migrations

For production environments, use migrations:

```bash
npx prisma migrate dev --name descriptive_name
npx prisma migrate deploy  # Production
```

## Component Development

### Creating New Components

1. Create component file in appropriate directory
2. Define prop types interface
3. Implement component logic
4. Add proper styling with Tailwind
5. Export component

**Component Structure:**
```typescript
// app/components/invoices/InvoiceCard.tsx
import { Invoice } from '@/app/types/invoice'

interface InvoiceCardProps {
  invoice: Invoice
  onEdit?: () => void
  onDelete?: () => void
}

export function InvoiceCard({
  invoice,
  onEdit,
  onDelete
}: InvoiceCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
      <p className="text-sm text-gray-600">{invoice.clientName}</p>
      {/* More content */}
    </div>
  )
}
```

## Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes
- Avoid inline styles
- Use custom classes in `globals.css` for repeated patterns
- Follow mobile-first responsive design

**Responsive Design:**
```typescript
<div className="w-full sm:w-1/2 lg:w-1/3">
  {/* Mobile: full width, Tablet: half width, Desktop: third width */}
</div>
```

### Custom Styles

For complex animations or effects not possible with Tailwind:
- Add to `app/styles/animations.css`
- Add to `app/styles/glassmorphism.css`
- Import in component if needed

## Testing

### Manual Testing Checklist

- [ ] Component renders correctly
- [ ] Forms validate input properly
- [ ] API endpoints return expected data
- [ ] Error states display appropriately
- [ ] Loading states show during async operations
- [ ] Responsive design works on mobile/tablet/desktop

### Testing API Endpoints

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

**Example:**
```bash
# Test invoice creation
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "123",
    "amount": 1500,
    "dueDate": "2025-11-30"
  }'
```

## Performance Optimization

### Best Practices

1. **Image Optimization**: Use Next.js `<Image>` component
2. **Code Splitting**: Lazy load components with `dynamic()`
3. **API Caching**: Implement proper cache headers
4. **Database Queries**: Optimize with proper indexes
5. **Bundle Size**: Monitor with `npm run build`

### Performance Monitoring

```typescript
// Use React Profiler for component performance
import { Profiler } from 'react'

<Profiler id="InvoiceList" onRender={onRenderCallback}>
  <InvoiceList />
</Profiler>
```

## Git Workflow

### Branch Naming

- `feature/description`: New features
- `bugfix/description`: Bug fixes
- `hotfix/description`: Urgent production fixes
- `refactor/description`: Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: add invoice PDF generation
fix: resolve date formatting issue
docs: update API documentation
refactor: simplify invoice calculations
style: format code with prettier
test: add unit tests for invoice service
chore: update dependencies
```

### Pull Request Process

1. Create descriptive PR title
2. Provide detailed description
3. Link related issues
4. Request reviews
5. Address feedback
6. Merge when approved

## Debugging

### Next.js Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### Common Issues

**Build failures:**
- Clear `.next` folder
- Verify all imports are correct
- Check TypeScript errors with `npm run type-check`

**API issues:**
- Check network tab in browser DevTools
- Verify environment variables are set
- Test endpoints with curl or Postman

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
