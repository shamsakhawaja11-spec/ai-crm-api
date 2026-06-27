# AI CRM API — Project Memory

## What This Is
An AI-powered CRM backend built with NestJS + TypeScript. Production-grade, multi-tenant SaaS.

## Tech Stack
- Framework: NestJS + TypeScript
- Database: PostgreSQL + Prisma ORM
- Vector Search: pgvector (PostgreSQL extension)
- Cache: Redis (ioredis)
- Queue: BullMQ
- LLM: Anthropic Claude API
- Embeddings: OpenAI text-embedding-3-small
- Real-time: Socket.io (@nestjs/websockets)
- Search: Meilisearch
- Email: Resend
- File Storage: Cloudinary
- Auth: JWT + Passport.js
- Docs: Swagger (@nestjs/swagger)
- Containers: Docker + Docker Compose
- CI/CD: GitHub Actions

## GitHub Repo
https://github.com/shamsakhawaja11-spec/ai-crm-api

## What's Done
- Docker Compose — PostgreSQL (pgvector/pg16) + Redis running
- Prisma connected, ai_crm_db created
- src/config/configuration.ts — typed env factory
- src/config/config.module.ts — Joi validation
- src/database/prisma.service.ts — lifecycle hooks, query logging, healthCheck
- src/database/database.module.ts — global module
- src/common/filters/http-exception.filter.ts
- src/common/interceptors/transform.interceptor.ts
- src/common/interceptors/logging.interceptor.ts
- src/common/interceptors/timeout.interceptor.ts
- src/common/interceptors/audit.interceptor.ts — stubbed
- src/common/pipes/validation.pipe.ts
- src/common/middleware/request-id.middleware.ts
- src/common/exceptions/business.exception.ts
- src/main.ts — global prefix v1, CORS, all pipes/filters/interceptors
- Prisma migration: User + RefreshToken models
- src/modules/auth/dto/register.dto.ts
- src/modules/auth/dto/login.dto.ts

## What's In Progress
- Auth module (refresh-token.dto, strategies, service, controller, module)

## What's Next (in order)
1. Finish Auth module
2. Full Prisma schema (all models)
3. Users module
4. Teams module
5. Contacts module
6. Companies module
7. Leads module
8. Deals module
9. Pipeline module
10. Activities, Tasks, Notes
11. Emails module
12. Notifications
13. AI module (LLM, embeddings, RAG, lead scoring, email drafting, sentiment, forecasting, summarization, NLP search, next-action, insights)
14. Queues (BullMQ)
15. Real-time (Socket.io gateway)
16. Reports, Webhooks, Admin
17. Shared services (Redis, Storage, Email, Search)
18. Tests (e2e)
19. Docker + CI/CD finalization

## Key Conventions
- All routes prefixed with /v1
- Response shape: { data, meta, pagination } via transform.interceptor
- Error shape: uniform via http-exception.filter
- Multi-tenant: workspace/team isolation on every query
- Roles: ADMIN, SALES_REP, MANAGER
- Never use TypeORM — Prisma only
- Always send git commit command after every file addition/modification


always send and make my code production level


Full file structure that i will be building in this project can change it if its not prouction level..

ai-crm-api/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── config.module.ts
│   │   └── configuration.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── workspace.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── workspace.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── audit.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── middleware/
│   │   │   ├── request-id.middleware.ts
│   │   │   └── workspace-resolver.middleware.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── exceptions/
│   │       └── business.exception.ts
│   │
│   ├── database/
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── refresh-token.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   │       ├── update-user.dto.ts
│   │   │       └── user-response.dto.ts
│   │   ├── teams/
│   │   │   ├── teams.module.ts
│   │   │   ├── teams.controller.ts
│   │   │   ├── teams.service.ts
│   │   │   └── dto/
│   │   │       ├── create-team.dto.ts
│   │   │       └── invite-member.dto.ts
│   │   ├── contacts/
│   │   │   ├── contacts.module.ts
│   │   │   ├── contacts.controller.ts
│   │   │   ├── contacts.service.ts
│   │   │   └── dto/
│   │   │       ├── create-contact.dto.ts
│   │   │       ├── update-contact.dto.ts
│   │   │       └── contact-filter.dto.ts
│   │   ├── companies/
│   │   │   ├── companies.module.ts
│   │   │   ├── companies.controller.ts
│   │   │   ├── companies.service.ts
│   │   │   └── dto/
│   │   │       ├── create-company.dto.ts
│   │   │       └── company-filter.dto.ts
│   │   ├── leads/
│   │   │   ├── leads.module.ts
│   │   │   ├── leads.controller.ts
│   │   │   ├── leads.service.ts
│   │   │   └── dto/
│   │   │       ├── create-lead.dto.ts
│   │   │       ├── update-lead.dto.ts
│   │   │       ├── convert-lead.dto.ts
│   │   │       └── lead-filter.dto.ts
│   │   ├── deals/
│   │   │   ├── deals.module.ts
│   │   │   ├── deals.controller.ts
│   │   │   ├── deals.service.ts
│   │   │   └── dto/
│   │   │       ├── create-deal.dto.ts
│   │   │       ├── update-deal.dto.ts
│   │   │       ├── move-stage.dto.ts
│   │   │       └── deal-filter.dto.ts
│   │   ├── pipeline/
│   │   │   ├── pipeline.module.ts
│   │   │   ├── pipeline.controller.ts
│   │   │   ├── pipeline.service.ts
│   │   │   └── dto/
│   │   │       ├── create-pipeline.dto.ts
│   │   │       └── create-stage.dto.ts
│   │   ├── activities/
│   │   │   ├── activities.module.ts
│   │   │   ├── activities.controller.ts
│   │   │   ├── activities.service.ts
│   │   │   └── dto/
│   │   │       ├── create-activity.dto.ts
│   │   │       ├── update-activity.dto.ts
│   │   │       └── log-call.dto.ts
│   │   ├── emails/
│   │   │   ├── emails.module.ts
│   │   │   ├── emails.controller.ts
│   │   │   ├── emails.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── templates.controller.ts
│   │   │   │   └── templates.service.ts
│   │   │   └── dto/
│   │   │       ├── send-email.dto.ts
│   │   │       ├── create-template.dto.ts
│   │   │       └── email-filter.dto.ts
│   │   ├── tasks/
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── dto/
│   │   │       ├── create-task.dto.ts
│   │   │       └── update-task.dto.ts
│   │   ├── notes/
│   │   │   ├── notes.module.ts
│   │   │   ├── notes.controller.ts
│   │   │   ├── notes.service.ts
│   │   │   └── dto/
│   │   │       └── create-note.dto.ts
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── dto/
│   │   │       └── mark-read.dto.ts
│   │   ├── reports/
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── dto/
│   │   │       └── report-filter.dto.ts
│   │   ├── webhooks/
│   │   │   ├── webhooks.module.ts
│   │   │   ├── webhooks.controller.ts
│   │   │   └── webhooks.service.ts
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   │
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── llm/
│   │   │   ├── llm.service.ts
│   │   │   └── prompt-builder.service.ts
│   │   ├── embeddings/
│   │   │   ├── embedding.service.ts
│   │   │   └── vector-store.service.ts
│   │   ├── rag/
│   │   │   ├── rag.module.ts
│   │   │   ├── rag.controller.ts
│   │   │   ├── rag.service.ts
│   │   │   └── retrieval.service.ts
│   │   ├── lead-scoring/
│   │   │   ├── lead-scoring.module.ts
│   │   │   ├── lead-scoring.controller.ts
│   │   │   ├── lead-scoring.service.ts
│   │   │   └── scoring-signals.ts
│   │   ├── email-drafting/
│   │   │   ├── email-draft.module.ts
│   │   │   ├── email-draft.controller.ts
│   │   │   └── email-draft.service.ts
│   │   ├── sentiment/
│   │   │   ├── sentiment.module.ts
│   │   │   ├── sentiment.controller.ts
│   │   │   └── sentiment.service.ts
│   │   ├── forecasting/
│   │   │   ├── forecasting.module.ts
│   │   │   ├── forecasting.controller.ts
│   │   │   └── forecasting.service.ts
│   │   ├── summarization/
│   │   │   ├── summarization.module.ts
│   │   │   ├── summarization.controller.ts
│   │   │   └── summarization.service.ts
│   │   ├── nlp-search/
│   │   │   ├── nlp-search.module.ts
│   │   │   ├── nlp-search.controller.ts
│   │   │   └── nlp-search.service.ts
│   │   ├── next-action/
│   │   │   ├── next-action.module.ts
│   │   │   ├── next-action.controller.ts
│   │   │   └── next-action.service.ts
│   │   └── insights/
│   │       ├── insights.module.ts
│   │       ├── insights.controller.ts
│   │       └── insights.service.ts
│   │
│   ├── queues/
│   │   ├── queues.module.ts
│   │   ├── email/
│   │   │   ├── email.producer.ts
│   │   │   └── email.consumer.ts
│   │   ├── ai-processing/
│   │   │   ├── ai.producer.ts
│   │   │   └── ai.consumer.ts
│   │   ├── notifications/
│   │   │   ├── notification.producer.ts
│   │   │   └── notification.consumer.ts
│   │   ├── webhooks/
│   │   │   ├── webhook.producer.ts
│   │   │   └── webhook.consumer.ts
│   │   └── analytics/
│   │       ├── analytics.producer.ts
│   │       └── analytics.consumer.ts
│   │
│   ├── realtime/
│   │   ├── realtime.module.ts
│   │   ├── realtime.gateway.ts
│   │   └── events/
│   │       ├── deal.events.ts
│   │       ├── lead.events.ts
│   │       ├── notification.events.ts
│   │       └── ai.events.ts
│   │
│   └── shared/
│       ├── redis/
│       │   └── redis.service.ts
│       ├── storage/
│       │   └── storage.service.ts
│       ├── email/
│       │   └── email.service.ts
│       └── search/
│           └── search.service.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── test/
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── leads.e2e-spec.ts
│   ├── deals.e2e-spec.ts
│   ├── ai-scoring.e2e-spec.ts
│   ├── ai-drafting.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── tsconfig.json
├── package.json
└── .github/
    └── workflows/
        └── ci.yml