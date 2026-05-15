# EcoStudent Architecture & Context Map

EcoStudent 🌱 is a location-aware, AI-powered web platform for students to buy, sell, exchange, or donate educational items.

## 🏗 Architecture Overview

The repository is structured as a **Turborepo** monorepo containing multiple microservices/applications and shared packages.

### 1. Frontend (`apps/frontend/`)
- **Core Framework**: Next.js 16 (React 19)
- **Styling & UI**: Tailwind CSS v4, Framer Motion, `@radix-ui`
- **State Management**: `@tanstack/react-query`
- **Mapping**: MapLibre GL, `@vis.gl/react-google-maps`
- **Real-time**: Socket.io client

### 2. Backend (`apps/backend/`)
- **Core Framework**: NestJS 11
- **Database ORM**: Prisma 7 connecting to PostgreSQL (with pgvector extension)
- **Authentication**: Passport.js (`jwt`, `local`, `google-oauth20`)
- **Real-time**: NestJS WebSockets (`@nestjs/platform-socket.io`)
- **Cloud/AI Integrations**: Google Cloud Storage (`@google-cloud/storage`), Google GenAI (`@google/genai`)

### 3. AI Service (`apps/ai/`)
- **Core Framework**: FastAPI (Python)
- **Data Science/ML**: `pandas`, `numpy`, `scikit-learn`, OpenAI CLIP
- **Database Connection**: SQLAlchemy, `psycopg2-binary`, pgvector
- **Purpose**: Calculates product recommendation scores, handles location-based filtering, and provides AI-powered image search by generating CLIP embeddings for product images and querying via pgvector similarity search.

### 4. Shared Packages (`packages/`)
- `eslint-config`: Shared linting configurations.
- `typescript-config`: Centralized TS configs.
- `ui`: Shared UI components across apps.
- `shared`: Common utilities or types.

## 📁 Repository Map

```text
/d:/EcoStudent
├─ apps/
│  ├─ frontend/       # Next.js + Tailwind frontend application
│  ├─ backend/        # NestJS REST API and WebSocket server
│  └─ ai/             # FastAPI recommendation & ML service
├─ packages/
│  ├─ eslint-config/  # Shared ESLint rules
│  ├─ typescript-config/ # Shared tsconfig.json bases
│  ├─ ui/             # Reusable UI component library
│  └─ shared/         # Common code
├─ prisma/            # Database schema and migrations (may live in backend/ai)
├─ package.json       # Monorepo workspaces definition
├─ turbo.json         # Turborepo task pipeline configuration
└─ readme.md          # Main project documentation
```

## 🔑 Key Workflows
- **Running Locally**: The project leverages Turborepo. Using `npm run dev` at the root kicks off dev servers for `apps/*`.
- **Database**: The core DB is PostgreSQL (with pgvector) managed by the `backend` Prisma schema.
- **Microservices Communication**: The `backend` routes intelligent search & recommendation queries to the `ai` FastAPI service, and falls back to standard SQL when necessary.
- **Image Search Pipeline**: Product creation triggers an async task to send image data from NestJS to FastAPI, which generates CLIP embeddings and updates PostgreSQL via pgvector for infinite-scroll image similarity search.
- **Real-Time Chat**: WebSockets power real-time messaging, with optimistic UI updates and immediate conversation synchronization on the frontend.
- **Search History**: The platform maintains user search history with ranked suggestions, live frontend filtering, and debounced API requests.
