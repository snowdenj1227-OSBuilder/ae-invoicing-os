# Setup

## Prerequisites

Before setting up AE Invoicing OS, ensure you have the following installed:

- **Node.js**: v20.x or higher
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: Latest version
- **Database**: PostgreSQL 14+ or MySQL 8+ (for Prisma)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/snowdenj1227-OSBuilder/ae-invoicing-os.git
cd ae-invoicing-os
```

### 2. Install Dependencies

Install the main application dependencies:

```bash
npm install
```

Install the worker dependencies:

```bash
cd worker
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ae_invoicing"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Notion Integration
NOTION_API_KEY="your_notion_api_key"
NOTION_DATABASE_ID="your_notion_database_id"

# Stripe Payment Processing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend Email Service
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="invoices@yourdomain.com"

# Authentication (if implementing auth)
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare Worker Variables
WORKER_URL="http://localhost:8787"
```

Create a `.env` file in the `worker` directory:

```env
NOTION_API_KEY="your_notion_api_key"
STRIPE_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."
```

### 4. Database Setup

Initialize the Prisma database:

```bash
npm run db:push
```

(Optional) Seed the database with sample data:

```bash
npm run seed
```

### 5. Notion Database Setup

If you're using Notion for data storage, run the setup script:

```bash
npm run setup
```

This will create the necessary databases in your Notion workspace.

## Configuration

### Cloudflare Worker Configuration

Edit `worker/wrangler.toml` to configure your worker:

```toml
name = "ae-invoicing-worker"
main = "src/index.ts"
compatibility_date = "2024-10-01"

[vars]
NOTION_API_KEY = "your_key_here"
STRIPE_SECRET_KEY = "your_key_here"
RESEND_API_KEY = "your_key_here"
```

### Next.js Configuration

The `next.config.ts` file is pre-configured for:
- Image optimization
- Strict mode
- Remote image patterns

Modify as needed for your deployment environment.

## Running the Application

### Development Mode

Start both the Next.js app and Cloudflare Worker in development mode:

```bash
npm run dev
```

This runs:
- Next.js on `http://localhost:3000`
- Cloudflare Worker on `http://localhost:8787`

Alternatively, run them separately:

```bash
# Terminal 1: Next.js
npm run build
npm run start

# Terminal 2: Worker
npm run worker:dev
```

### Production Build

Build the Next.js application:

```bash
npm run build
npm run start
```

Build and deploy the Cloudflare Worker:

```bash
npm run worker:build
npm run worker:deploy
```

## Verification

After setup, verify everything is working:

1. **Next.js App**: Visit `http://localhost:3000`
2. **Worker**: Check `http://localhost:8787` for worker health
3. **Database**: Run `npm run db:studio` to open Prisma Studio
4. **API**: Test API endpoints at `http://localhost:3000/api/invoices`

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection issues:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

**Notion API errors:**
- Verify API key has proper permissions
- Check database IDs are correct
- Ensure integration is added to databases

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## Next Steps

- Read [DEVELOPMENT.md](./DEVELOPMENT.md) for development guidelines
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
- Check [API.md](./API.md) for API documentation
