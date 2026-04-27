# VentureNest

A modern full-stack MERN platform that connects entrepreneurs and investors through real-time chat and video calling. Built with a scalable clean architecture backend, responsive React frontend, and production-ready deployment tools.

![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-green)
![MongoDB](https://img.shields.io/badge/MongoDB-darkgreen)
![WebRTC](https://img.shields.io/badge/WebRTC-video-orange)
![Docker](https://img.shields.io/badge/Docker-enabled-blue)

---

## 🚀 Project Overview

VentureNest enables founders and investors to communicate instantly with advanced collaboration features:

- Real-time chat with send, delete, read, and delivery status
- File and image sharing in conversations
- Peer-to-peer video calling using WebRTC
- Role-based authentication for Entrepreneurs and Investors
- Clean architecture backend with modular services and repositories
- Docker support for local development and production
- CI/CD automation using GitHub Actions

---

## ✨ Features

- **Full message lifecycle**: send text, track delivery, read receipts, and delete messages
- **File & image sharing**: upload and share attachments securely in chat
- **Video calling**: direct WebRTC video sessions for investor and entrepreneur meetings
- **Authentication**: separate User and Investor roles with secure login and registration
- **Responsive UI**: React + TypeScript interface optimized for desktop and mobile
- **Socket-powered updates**: live chat and notification sync using Socket.IO
- **Docker support**: containerized backend and frontend for easier deployment
- **CI/CD workflow**: automated build, test, and deployment pipelines with GitHub Actions

---

## 💻 Tech Stack

- Frontend: `React`, `TypeScript`, `Tailwind CSS`, `Vite`
- Backend: `Node.js`, `Express`, `TypeScript`
- Database: `MongoDB`
- Real-time: `Socket.IO`, `WebRTC`
- Containerization: `Docker`, `docker-compose`
- CI/CD: `GitHub Actions`

---

## 🛠 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shaun-N-S/VentureNest.git
cd VentureNest
```

### 2. Install dependencies

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 3. Configure environment variables

Create `.env` files for both backend and frontend as shown below.

### 4. Start development servers

```bash
# Backend
cd Backend
npm run dev

# Frontend
cd ../Frontend
npm run dev
```

---

## ⚙️ Environment Variables

This project uses `.env` files for configuration.

👉 Copy the example files and update values:

### Backend (`Backend/.env`)

```bash
cd Backend
cp .env.example .env
```

### Frontend (`Frontend/.env`)

```bash
cd Frontend
cp .env.example .env
```

---

## 📁 Project Structure

### Backend

- `src/app.ts` — application entry point
- `src/config/` — configuration and environment setup
- `src/application/` — use cases, DTOs, and mappers
- `src/domain/` — entities, interfaces, types, enums
- `src/infrastructure/` — data access, services, cache, cron jobs
- `src/interfaceAdapters/` — controllers, middleware, routes
- `src/shared/` — constants, utils, and validation logic

### Frontend

- `src/main.tsx` — app bootstrap
- `src/App.tsx` — root application component
- `src/components/` — reusable UI and feature components
- `src/hooks/` — custom hooks for auth, chat, socket, etc.
- `src/pages/` — route pages for admin, investor, and user flows
- `src/services/` — API service modules
- `src/routes/` — frontend route definitions
- `src/lib/` — helper utilities and socket client

---

## 🐳 Docker Setup

### Build and run with Docker

```bash
docker-compose up --build -d
```

### Stop containers

```bash
docker-compose down
```

This repository includes Docker support for both backend and frontend services, making local development and production deployment easier.

---

## 🚦 CI/CD

A GitHub Actions pipeline is included to automate:

- dependency installation
- linting and static checks
- backend and frontend build processes
- optional deployment to staging or production environments

> Place workflows in `.github/workflows/` and customize the pipeline to your deployment provider.

---

## ☁️ Deployment

To deploy VentureNest in production, use a cloud provider or container hosting service:

- Deploy backend API to AWS, Azure, DigitalOcean, or Render
- Deploy frontend to Vercel, AWS Amplify, Netlify, or any static site host
- Use MongoDB Atlas or a managed MongoDB service for database hosting
- Configure environment variables and secrets in your deployment platform

---

## 🔮 Future Improvements

- Add investor onboarding and analytics dashboards
- Implement in-app notifications and email alerts
- Add payment/subscription support for premium features
- Improve video call scheduling and meeting rooms
- Add advanced search and matching algorithms for deals
- Expand mobile experience with progressive web app support

---

<!-- ## 📌 License

This project is open source. Add your preferred license file to the repository. -->

---

## 💬 Contact

For questions or contributions, open an issue or submit a pull request.

