# Universe - GitHub Projects Tracker Task

A full-stack application for tracking and managing GitHub repositories with real-time metrics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd universe
   ```

2. **Start the server and database**

   ```bash
   cd server
   cp .env.example .env
   # fill in the .env file with the correct values
   docker-compose up -d
   ```

3. **Set up the client**

   ```bash
   cd client
   cp .env.example .env
   # fill in the .env file with the correct values (you can leave as is if you haven't changed the api port for server)
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
universe/
├── client/          # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── shared/  # Shared components, hooks, utilities
│   │   └── services/ # API service layer
│   └── README.md    # Frontend-specific documentation
├── server/          # Node.js + Express backend
│   ├── src/
│   │   ├── modules/ # Feature modules (auth, projects)
│   │   ├── shared/  # Shared utilities and ports
│   │   └── infrastructure/ # Database and external services
│   └── README.md    # Backend-specific documentation
└── README.md        # This file - project overview
```

## 🏗️ Architecture

### Frontend (Client)

- **Framework**: React 19 with TypeScript
- **State Management**: TanStack Query for server state
- **UI**: Shadcn UI
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v7

### Backend (Server)

- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **External APIs**: GitHub API integration

## 📚 Documentation

- [Frontend Documentation](./client/README.md) - Client setup and development
- [Backend Documentation](./server/README.md) - Server setup and development

## 🔧 Environment Variables

### Server (.env)

```env
NODE_ENV=production
API_PORT=8000
API_URL=http://localhost:8000/api

JWT_SECRET=your-jwt-secret
JWT_ACCESS_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800

POSTGRES_USER=your-db-user
POSTGRES_PASSWORD=your-db-pass
POSTGRES_DB=your-db-name

DB_HOST=db
DB_PORT=5432
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}

DB_HOST_EXTERNAL=localhost
DB_PORT_EXTERNAL=5432
DATABASE_URL_EXTERNAL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST_EXTERNAL}:${DB_PORT_EXTERNAL}/${POSTGRES_DB}

GITHUB_ACCESS_TOKEN=your-github-token
```

### Client (.env)

```env
VITE_API_URL=http://localhost:8000/api
```
