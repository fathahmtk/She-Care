# She-Care — Ecommerce (Scaffold)

This branch contains a production-ready scaffold for the She-Care ecommerce app.

Stack:
- Next.js (TypeScript)
- Tailwind CSS
- Prisma + PostgreSQL
- Redis (optional)
- Stripe for payments
- Docker + docker-compose for local dev
- GitHub Actions CI for test/build

Quickstart (local)
1. Copy environment variables:
   cp .env.example .env
2. Start Postgres and Redis:
   docker-compose up -d
3. Install deps:
   pnpm install
4. Apply migrations:
   pnpm prisma migrate dev --name init
5. Start dev server:
   pnpm dev

Important scripts
- pnpm dev — start Next dev server
- pnpm build — production build
- pnpm start — start production server after build
- pnpm prisma:migrate — run prisma migrations
- pnpm lint — run ESLint
- pnpm test — run tests (if added)

Notes
- Replace Stripe keys and SMTP settings in .env before testing payments/emails.
- This scaffold includes example webhook handling and a minimal data model.