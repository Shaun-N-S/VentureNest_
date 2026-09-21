# VentureNest

VentureNest is a full-stack platform that connects early-stage startup founders with investors. Founders publish structured startup profiles, manage inbound pitches, and negotiate investment offers through a guided workflow; investors discover startups, evaluate them with premium visibility tools, send and track offers, and manage funded deals with staged payouts. The platform layers on real-time messaging, notifications, video-call sessions, a community feed, a reporting and moderation system, Stripe-backed subscriptions that gate premium capabilities, and an admin console for users, plans, finances, and content review.

## Live Demo

- Frontend: https://vn.shaunns.online
- Backend API: https://api.venturenest.shaunns.online

## Table of Contents

- [Platform Purpose](#platform-purpose)
- [User Roles](#user-roles)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Production Deployment](#production-deployment)
- [Monitoring Stack](#monitoring-stack)
- [CI/CD Pipeline](#cicd-pipeline)
- [Folder Structure](#folder-structure)
- [Future Improvements](#future-improvements)
- [Screenshots](#screenshots)
- [Author](#author)

## Platform Purpose

VentureNest exists to shorten the distance between a founder with a real startup and an investor willing to back it. Instead of cold outreach and scattered spreadsheets, founders maintain one structured, verifiable project profile; investors browse, filter, and evaluate that profile with tools gated by subscription tier; and the entire pitch-to-deal lifecycle — pitch, offer, negotiation, acceptance, staged payout — happens on one platform with an audit trail, rather than over email.

## User Roles

| Role | Description |
|---|---|
| **Founder (User)** | Publishes and manages startup projects, receives pitches and offers, builds a network, books/attends sessions. |
| **Investor** | Discovers startups, sends investment offers, manages a portfolio of deals, builds a network, books/attends sessions. |
| **Admin** | Moderates users, investors, projects, and reports; manages subscription plans, platform wallet, and withdrawals from a dedicated console. |

## Features

### Founder
- Create and publish startup projects with company details, funding terms, founders, vision, and pitch deck
- Receive and manage investor pitches; respond or carry them into a deal
- Review, accept, or reject investment offers through a structured workflow
- Track a project-level investor list once deals are funded
- Unlock investor insights and higher usage limits through subscription plans

### Investor
- Browse and filter startups by stage, sector, and traction
- Send investment offers specifying amount, equity, valuation, and terms
- Track portfolio and per-deal funding progress
- Manage accepted deals with staged installment payments via Stripe or wallet

### Admin
- User and investor account management, including KYC/verification review
- Project listing oversight and moderation
- Report queue for user- and project-level complaints
- Subscription plan management
- Platform wallet, transactions, and withdrawal request handling
- Admin dashboard with platform-level metrics

### Authentication
- Email/password and Google OAuth sign-up/login
- OTP email verification for new accounts
- JWT access tokens with refresh-token rotation (short-lived access token, refresh cookie)
- Password reset flow

### Sessions
- Investors book video-call sessions with founders (or vice versa) with an approve/join workflow
- Real-time video signaling (offer/answer/ICE candidates) over Socket.IO
- Session join/leave room management with participant notifications

### Community
- Post feed with likes, comments, and threaded replies
- Follow/connect with other founders and investors to build a professional network
- Real-time chat with delivery and read receipts
- In-app notifications for pitches, offers, deals, connections, and social activity

### Premium Plans
- Stripe-backed subscription plans with plan-based feature gating and usage limits
- Server-side enforcement (403 on gated actions) in addition to client-side gating
- Plan limits support an explicit "unlimited" value for top-tier plans

### Project Management
- Structured project creation: company details, funding terms, founders, vision, pitch deck, logo, and cover image (uploaded to S3 with signed-URL delivery)
- Monthly report submission for active projects
- Company registration/GST verification document upload and review
- Like/unlike with a real-time-consistent like count and per-user liked state

## Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Routing | React Router 7 |
| State | Redux Toolkit + redux-persist, TanStack React Query |
| Styling | Tailwind CSS, shadcn/ui (Radix primitives) |
| Forms | React Hook Form + Zod |
| Real-time | Socket.IO client |
| Other | React PDF (pitch deck preview), Cropper.js (image cropping), Recharts |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js, Express 5, TypeScript |
| Architecture | Clean Architecture (domain / application / infrastructure / interfaceAdapters), dependency injection via `tsyringe` |
| Validation | Zod |
| Real-time | Socket.IO |
| Background jobs | node-cron |
| File uploads | Multer → AWS S3 (signed URLs) |
| Email | Nodemailer |

### Database
| Category | Technology |
|---|---|
| Primary datastore | MongoDB (Mongoose ODM), MongoDB Atlas in production |
| Cache / session support | Redis (`ioredis`) |

### Authentication
- JWT (`jsonwebtoken`) for access/refresh tokens
- `bcrypt` for password hashing
- Google OAuth via `google-auth-library`
- Role-based route guards (`authGuard`, `userOrInvestorGuard`, `adminGuard`) enforced on the backend, mirrored by protected routes on the frontend

### Deployment
- Frontend: AWS Amplify
- Backend + monitoring stack: Docker Compose on a single AWS EC2 instance
- Container registry: Docker Hub
- Payments: Stripe (Checkout + webhooks)

### Monitoring
- **Prometheus** for metrics collection and scraping
- **Grafana** for dashboards and alerting, provisioned entirely as code (datasources, dashboards, alert rules, and contact points — no manual UI setup required)
- Custom HTTP-level metrics (`prom-client`) instrumented on the backend

## Architecture Overview

- **Clean Architecture** on the backend, with `domain`, `application`, `infrastructure`, and `interfaceAdapters` layers, wired together through per-feature dependency-injection containers
- **Role-based access control** (founder, investor, admin) enforced by Express middleware guards on the backend and route wrappers (`ProtectedRoute`) on the frontend — every protected page is unreachable to unauthenticated users before any API call is even made
- **Modular, use-case-driven business logic**: controllers stay thin, use cases hold the business rules, repositories isolate MongoDB access
- **Subscription-driven feature access** enforced on both client (UI gating) and server (hard 403s), so gating can't be bypassed by calling the API directly
- **Observability by design**: `/health` and `/metrics` endpoints, structured request logging, and a fully provisioned Prometheus + Grafana stack running alongside the API in production

## Local Setup

Prerequisites: Node.js 20+, MongoDB, Redis.

```bash
git clone https://github.com/Shaun-N-S/VentureNest_.git
cd VentureNest_

# Backend
cd Backend && cp .env.example .env && npm install && npm run dev

# Frontend (in a second terminal)
cd Frontend && cp .env.example .env && npm install && npm run dev
```

Backend runs on `http://localhost:4000`, Frontend on Vite's default dev port. Fill in real values in both `.env` files before starting (see [Environment Variables](#environment-variables)).

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Port the API listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign access/refresh tokens |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost factor |
| `FRONTEND_URL` | Allowed CORS origin |
| `GOOGLE_MAIL` / `GOOGLE_APP_PASSWORD` | SMTP credentials for transactional email (OTP, notifications) |
| `REDIS_URL` | Redis connection string |
| `NODE_ENV` | `DEVELOPMENT` or `PRODUCTION` |
| `ACCESS_TOKEN_EXPIRATION_TIME` / `REFRESH_TOKEN_EXPIRATION_TIME` | JWT lifetimes |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECERT` | Google OAuth credentials |
| `S3_BUCKET_NAME` / `S3_REGION` / `S3_ACCESS_KEY` / `S3_SECRET_ACCESS_KEY` | AWS S3 credentials for file uploads |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe API and webhook signing credentials |

### Frontend (`Frontend/.env`)

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (must match the backend's) |

### Docker Compose (repo-root `.env`, production only)

The same variables the backend needs, plus:

| Variable | Purpose |
|---|---|
| `GF_SECURITY_ADMIN_USER` / `GF_SECURITY_ADMIN_PASSWORD` | Grafana admin login |
| `GF_SMTP_USER` / `GF_SMTP_PASSWORD` | Credentials Grafana uses to send alert notification emails |

This file lives only on the deployment host (`~/venturenest/.env`) and is never committed or touched by CI/CD.

## Docker Setup

The repo-root [`docker-compose.yml`](docker-compose.yml) runs the full production stack as three services on one internal bridge network (`app-network`):

| Service | Image | Exposed as | Notes |
|---|---|---|---|
| `backend` | `shaun1092/venturenest-backend` (built from `Backend/Dockerfile`) | `4000` | Node API, `GET /health` healthcheck |
| `prometheus` | `prom/prometheus` | `127.0.0.1:9090` (loopback only) | Scrapes the backend's `/metrics` endpoint |
| `grafana` | `grafana/grafana` | `3001` | Dashboards + alerting, datasource/dashboards/alerts all provisioned from `monitoring/` |

To run the full stack locally:

```bash
docker compose up -d
```

Prometheus and Grafana's configuration is entirely file-based under [`monitoring/`](monitoring/) — nothing needs to be clicked through in either UI. `prometheus`'s port is intentionally bound to loopback only (`127.0.0.1:9090`), since its API has no built-in authentication; `grafana` is the one component meant to be reachable, since it's login-gated.

## Production Deployment

- **Frontend** is deployed on AWS Amplify, built directly from the `Frontend/` directory.
- **Backend + monitoring stack** run on a single AWS EC2 instance via Docker Compose.
- Deployment is fully automated: pushing to `main` builds and pushes a new backend image, copies `docker-compose.yml` and `monitoring/` to the server, and reconciles the running stack with `docker compose pull && docker compose up -d`. See [CI/CD Pipeline](#cicd-pipeline) for the exact flow.
- The server's `.env` (secrets) is never copied, overwritten, or touched by the pipeline — it is managed manually on the host, once.

## Monitoring Stack

### Prometheus
Scrapes the backend's `/metrics` endpoint every 15 seconds (`monitoring/prometheus/prometheus.yml`) using Docker's internal DNS (`backend:4000`) — scrape traffic never leaves the internal network. Its own UI/API is bound to `127.0.0.1:9090` on the host, so it's reachable for local debugging but not exposed publicly.

### Grafana
Runs three dashboards, auto-provisioned from `monitoring/grafana/provisioning/dashboards/json/`:

| Dashboard | Covers |
|---|---|
| **API Overview** | Requests/min, requests by route, error rate, active requests, top failing routes |
| **API Performance** | P50/P90/P95/P99 latency, slowest endpoints |
| **Runtime Health** | CPU, memory (RSS), heap usage, event loop lag, GC duration, active handles/resources |

The Prometheus datasource is auto-provisioned (`monitoring/grafana/provisioning/datasources/`) with a fixed UID so dashboards and alert rules can reference it deterministically without any manual "add datasource" step.

### Metrics Endpoint
`GET /metrics` on the backend exposes Prometheus-format metrics: default Node.js process metrics (CPU, memory, heap, event loop lag, GC, active handles/resources) plus custom HTTP metrics (`http_requests_total`, `http_request_duration_seconds`, `http_requests_in_progress`, `http_errors_total`), each labeled by method, route, and status code. The endpoint is unauthenticated (standard for scrape targets) and exempt from the API's rate limiter.

### Alerting
Three critical alert rules run inside Grafana's own alerting engine, provisioned as code (`monitoring/grafana/provisioning/alerting/`):

| Alert | Condition |
|---|---|
| **Backend Down** | `up{job="venturenest-backend"}` is 0 for 2 minutes |
| **High Error Rate** | 4xx/5xx rate exceeds 5% of total requests for 5 minutes |
| **High Memory Usage** | Backend RSS exceeds 600MB for 10 minutes |

Alerts route to a provisioned contact point and generate links back to Grafana using its configured public root URL, so notification emails point at the real dashboard rather than `localhost`.

## CI/CD Pipeline

A single GitHub Actions workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every push to `main`:

1. Checkout, install, lint, and build both `Backend/` and `Frontend/`
2. Build and push the backend Docker image to Docker Hub
3. Copy `docker-compose.yml` and `monitoring/` to the EC2 host (never `.env`)
4. SSH into the host and run `docker compose pull && docker compose up -d`
5. Wait for the backend's `/health` endpoint to report healthy; fail the job (with backend logs attached) if it doesn't come up in time

The deploy step is idempotent: it safely upgrades an already-running stack, and includes a one-time migration guard that only removes a legacy, non-Compose-managed `backend` container if one exists.

## Folder Structure

```
VentureNest_/
├── .github/
│   └── workflows/           # CI/CD pipeline
├── monitoring/
│   ├── prometheus/          # Prometheus scrape config
│   └── grafana/
│       └── provisioning/    # datasources, dashboards, alerting — all as code
├── Backend/
│   └── src/
│       ├── domain/             # entities, repository/service interfaces, enums
│       ├── application/        # use cases, DTOs, mappers
│       ├── infrastructure/     # db, cache, realtime, services, cron, DI, metrics
│       ├── interfaceAdapters/  # controllers, middleware, routes
│       └── shared/             # constants, utils, validation schemas
├── Frontend/
│   └── src/
│       ├── components/         # UI and feature components
│       ├── pages/               # admin, investor, and founder routes
│       ├── hooks/                # data and socket hooks
│       ├── services/             # API clients
│       ├── store/                # Redux slices
│       └── sockets/              # Socket.IO client
└── docker-compose.yml        # backend + prometheus + grafana
```

## Future Improvements

- Add a reverse proxy (e.g. nginx) in front of the stack for TLS termination and to remove the need for a directly-published backend port
- Add a `Frontend` Dockerfile so the whole stack (including frontend) can be containerized consistently, rather than relying on Amplify alone
- Add automated tests (unit/integration) to both Backend and Frontend — none currently run in CI
- Restrict Grafana's admin UI to a VPN/allowlisted network rather than a public port, now that it's the one exposed monitoring component
- Move alert notification delivery beyond a single email contact point (e.g. Slack, PagerDuty) for on-call rotation support

## Screenshots

_Add product screenshots here (landing page, founder dashboard, investor discovery, project details, admin console, Grafana dashboards)._

## Author

Shaun N S
- GitHub: https://github.com/Shaun-N-S
- LinkedIn: www.linkedin.com/in/shaun-n-s-802a32326
