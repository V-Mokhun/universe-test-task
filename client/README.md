# Universe Client

Frontend application for the Universe GitHub Projects Tracker built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- The server should be running (see [server README](../server/README.md))

### Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🏗️ Architecture

This frontend follows modern React patterns with the following structure:

```
src/
├── app.tsx              # Main app component with routing
├── main.tsx             # Application entry point
├── pages/               # Page components
│   ├── login/          # Authentication pages
│   ├── register/       # User registration
│   └── projects/       # Projects management
├── shared/             # Shared utilities and components
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # Base UI components (buttons, forms, etc.)
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions
├── services/           # API service layer
│   ├── auth-service/  # Authentication API calls
│   ├── projects-service/ # Projects API calls
│   └── http-client/   # HTTP client configuration
|   └── base-service/  # Base service
├── context/           # React context providers
├── providers/         # Application providers
└── widgets/           # Feature-specific components
```

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query for server state
- **UI Library**: Shadcn UI
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v7
- **HTTP Client**: Custom service layer with fetch API

## � Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript type checking
```

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## 📦 Production Build

### Build Process

```bash
npm run build
```

This creates a production-ready build in the `dist/` directory.
