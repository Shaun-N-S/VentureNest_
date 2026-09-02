# VentureNest

VentureNest is a full-stack platform that connects early-stage startup founders with investors. Founders publish structured startup profiles, manage inbound pitches, and negotiate investment offers through a guided workflow; investors discover startups, evaluate them with premium visibility tools, send and track offers, and manage funded deals with staged payouts. The platform layers on real-time messaging, notifications, a reporting and moderation system, Stripe-backed subscriptions that gate premium capabilities, and an admin console for users, plans, finances, and content review.

## Live Demo

- Frontend: https://vn.shaunns.online
- Backend API: https://api.venturenest.shaunns.online

## Key Features

### For Founders
- Create and publish startup projects with company details, funding terms, founders, vision, and pitch deck
- Receive and manage investor pitches; respond or carry them into a deal
- Review, accept, or reject investment offers through a structured workflow
- Discover and connect with investors and build a professional network
- Track a project-level investor list once deals are funded
- Unlock investor insights and higher usage limits through subscription plans

### For Investors
- Browse and filter startups by stage, sector, and traction
- Send investment offers specifying amount, equity, valuation, and terms
- Track portfolio and per-deal funding progress
- Follow and connect with founders and other investors
- Manage accepted deals with staged installment payments via Stripe or wallet

### Platform Features
- Email/password and Google OAuth authentication with OTP verification
- JWT access tokens with refresh-token rotation
- Real-time chat with delivery and read status
- In-app notifications for pitches, offers, deals, and connections
- User and project reporting with an admin moderation queue
- Stripe subscriptions with plan-based feature gating and limits
- Admin console for users, plans, wallet and transactions, and reports

## Tech Stack

Frontend
- React 19
- TypeScript
- Redux Toolkit (with redux-persist)
- TanStack React Query
- Tailwind CSS
- shadcn/ui (Radix primitives)
- Vite, React Router, React Hook Form + Zod, Socket.IO client

Backend
- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Redis, Socket.IO, Zod, JWT + bcrypt, Multer, Nodemailer, node-cron

Infrastructure
- AWS (EC2, Amplify, S3)
- Docker / Docker Compose
- GitHub Actions
- Stripe
- MongoDB Atlas, Redis

## Quick Start

Prerequisites: Node.js 20+, MongoDB, Redis.

```bash
git clone https://github.com/Shaun-N-S/VentureNest_.git
cd VentureNest_

# Backend
cd Backend && cp .env.example .env && npm install && npm run dev

# Frontend (in a second terminal)
cd Frontend && cp .env.example .env && npm install && npm run dev
```

## Architecture Highlights

- Clean Architecture with `domain`, `application`, `infrastructure`, and `interfaceAdapters` layers
- Dependency injection through per-feature containers
- Role-based access control (founder, investor, admin) enforced by route guards
- Modular feature structure with use-case-driven business logic
- JWT authentication using short-lived access tokens and refresh-token cookies
- Subscription-driven feature access enforced on both client and server

## Notable Implementations

- Real-time chat and notifications over Socket.IO with room-based routing and dedicated event publishers
- Infinite scrolling built on React Query and IntersectionObserver, backed by paginated aggregation queries
- Premium investor-visibility system: subscription-gated data, server-side enforcement returning 403, and signed S3 URLs for media
- Subscription feature gating: Stripe Checkout and webhooks drive plan state; plan limits support an explicit unlimited value
- Secure authentication flows: Google OAuth, OTP email verification, bcrypt hashing, Helmet, and request rate limiting
- Image cropper and upload pipeline: client-side crop, canvas export, multipart upload to S3, and signed-URL delivery
- Investment offer workflow: offer to accepted deal to staged installment payments, with scheduled expiry jobs
- MongoDB aggregation pipelines for admin finance reporting and paginated list views

## Deployment

- Frontend deployed on AWS Amplify
- Backend containerized with Docker and deployed on AWS EC2
- CI/CD via GitHub Actions: install, lint, and build both apps, then build and push the backend image to Docker Hub and roll it out on EC2 over SSH

## Project Structure

```
VentureNest_/
├── Backend/
│   └── src/
│       ├── domain/             # entities, repository/service interfaces, enums
│       ├── application/        # use cases, DTOs, mappers
│       ├── infrastructure/     # db, cache, realtime, services, cron, DI
│       ├── interfaceAdapters/  # controllers, middleware, routes
│       └── shared/             # constants, utils, validation schemas
└── Frontend/
    └── src/
        ├── components/         # UI and feature components
        ├── pages/              # admin, investor, and founder routes
        ├── hooks/              # data and socket hooks
        ├── services/           # API clients
        ├── store/              # Redux slices
        └── sockets/            # Socket.IO client
```

## Author

Shaun N S
- GitHub: https://github.com/Shaun-N-S
- LinkedIn: www.linkedin.com/in/shaun-n-s-802a32326
