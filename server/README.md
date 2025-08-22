# Universe Server

Backend API server for the Universe GitHub Projects Tracker application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server and database**

   ```bash
   docker-compose up -d
   ```

The server will be available at `http://localhost:8000`

## 🏗️ Architecture

```
prisma
├── migrations/ # Database migrations
├── schema.prisma # Database schema
src/
├── modules/           # Feature modules (auth, projects)
│   ├── auth/         # Authentication module
│   └── projects/     # Projects management module
├── shared/           # Shared utilities and interfaces
│   ├── ports/        # Interface definitions
│   └── logger/       # Logging utilities
├── infrastructure/   # External dependencies
│   ├── repositories/ # Database implementations
│   └── providers/    # External API integrations
└── middleware/       # Express middleware
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

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

## 📦 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Type check
npm run db:generate  # Generate Prisma client
npm run db:migrate-local   # Create a new migration
```
