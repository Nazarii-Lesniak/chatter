# Chatter — Real-Time Chat Application

[![Live Demo on Vercel](https://img.shields.io/badge/Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://your-chatter-deployment.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**Chatter** is a modern, responsive full-stack real-time messaging application designed with mobile-first principles, clean Feature-Sliced Design (FSD) architecture, and instant WebSocket synchronization.

🔗 **Live Deployment:** [Chatter on Vercel](https://your-chatter-deployment.vercel.app) *(In Progress)*

---

> [!IMPORTANT]
> ### ⚠️ Note on Initial Load & Free Tier Database
> The database and backend server may run on free-tier hosting infrastructure that spins down after inactivity.
> **The very first page load can take up to 1 minute** while the backend and database instance wake up from sleep mode. Once connected, all real-time events, messaging, and presence updates operate with instant latency.

---

## 🌟 Features

- **Real-Time Messaging:** Fast, bidirectional communication powered by WebSockets (`ws`).
- **Live User Presence:** Instant `online` / `offline` status indicators in the chat header.
- **Mobile-First Responsive Layout:**
  - Clean view switching between conversations list and active chat with native slide transitions, plus drawer navigation.
  - Side-by-side conversation list and chat window with slide-out sidebar drawer.
  - Three-column layout displaying the floating pill sidebar, conversation list, and chat window simultaneously.
- **Long-Term Session Persistence:** Secure authentication with JWT stored in HTTP-only cookies, lasting **30 days** without premature logouts.
- **Protected Routes & Redirection:** Unauthorized users are automatically redirected to the login page; logged-in users cannot access auth forms.
- **Conversation Previews:** The conversation list displays a snippet of the latest message and human-readable timestamps (`12:45`, `Yesterday`, `Mon`, or `Sep 30`).
- **Smooth Auto-Hiding Scrollbars:** Custom scrollbars themed to match the app palette that auto-fade 1 second after scrolling stops.
- **User Discovery:** Real-time search to discover other registered users and start private conversations.

---

## 🛠️ Tech Stack

### Client
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Architecture:** Feature-Sliced Design (FSD)

### Server
- **Runtime:** [Node.js](https://nodejs.org/) with [Express 5](https://expressjs.com/)
- **Language:** TypeScript
- **Real-Time Protocol:** WebSockets ([ws](https://github.com/websockets/ws))
- **Database:** [PostgreSQL](https://www.postgresql.org/) (`pg` connection pool)
- **Security:** [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (JWT) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) password hashing

---

## 📁 Repository Structure

```text
chatter/
├── client/                               # Next.js frontend application (Feature-Sliced Design)
│   ├── src/
│   │   ├── app/                          # App Router: routes, pages, global styles, and providers
│   │   ├── widgets/                      # Composite UI: large, self-contained layout blocks (Sidebar, ChatWindow)
│   │   ├── features/                     # User actions: business-value capabilities (auth, send-message, search)
│   │   ├── entities/                     # Business entities: core domain logic and internal state (user, message)
│   │   └── shared/                       # Reusable primitives: abstract UI components, API clients, and utilities
│   ├── next.config.ts                    # Next.js configuration
│   ├── package.json                      # Frontend dependencies & scripts
│   └── tsconfig.json                     # Frontend TypeScript configuration
│
├── server/                               # Express + WebSocket backend (Layered & Repository Architecture)
│   ├── database/                         # Database initialization scripts and SQL schemas
│   ├── src/
│   │   ├── auth/                         # Authentication layer (JWT, secure cookies, and route protection)
│   │   ├── config/                       # Application configuration and environment variables
│   │   ├── infrastructure/               # Low-level infrastructure (PostgreSQL database pool & WebSocket server)
│   │   ├── modules/                      # Domain-driven modules encapsulated with Services & Repositories (users, messages)
│   │   ├── types/                        # Custom TypeScript declarations and Express type extensions
│   │   ├── app.ts                        # Express application setup, middlewares, and routing pipeline
│   │   └── index.ts                      # Server entrypoint initializing HTTP and WebSocket runtimes
│   ├── package.json                      # Backend dependencies & scripts
│   └── tsconfig.json                     # Backend TypeScript configuration
│
├── biome.json                            # Biome toolchain configuration (Linter & Formatter)
├── package.json                          # Monorepo root workspace configuration and unified scripts
└── README.md                             # Project overview and main documentation

```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **PostgreSQL** instance (local or hosted e.g. Neon, Supabase, Railway)

### 1. Clone the repository

```bash
git clone https://github.com/Nazarii-Lesniak/chatter.git
cd chatter
```

### 2. Install dependencies

Install dependencies for all workspaces from the project root:

```bash
npm install
```

### 3. Environment Configuration

#### Server Configuration
Create a `.env` file in the `server/` directory:

```env
PORT=3001
WS_PATH=/ws
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/chatter
NODE_ENV=development
```

#### Client Configuration
Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

*(For production, set `NEXT_PUBLIC_API_URL` to your hosted backend API URL, e.g. `https://your-api.onrender.com`).*

---

### 4. Running the Development Servers

You can run both client and server concurrently using the root package scripts:

#### In terminal 1 (Backend Server):
```bash
npm run dev:server
```
*Server starts at `http://localhost:3001` with WebSocket endpoint `ws://localhost:3001/ws`.*

#### In terminal 2 (Frontend Client):
```bash
npm run dev:client
```
*Client starts at `http://localhost:3000`.*

Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting!

---

### 5. Building for Production

To validate and build both projects:

```bash
# Build server
npm run --workspace=@chatter/server build

# Build client
npm run --workspace=@chatter/client build
```

---
