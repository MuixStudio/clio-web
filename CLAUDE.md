# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `pnpm@10.23.0` (required)

```bash
# Development server (with Turbopack)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint and auto-fix
pnpm lint

# Add shadcn components
pnpm dlx shadcn@latest add <component-name>
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui (migrated from HeroUI)
- **Styling**: Tailwind CSS 4 with CSS variables
- **State Management**: SWR for data fetching
- **HTTP Client**: ky with custom wrapper
- **Animations**: Framer Motion
- **Icons**: Lucide React + @iconify/react
- **Notifications**: Sonner (toast)
- **Theme**: next-themes

## Architecture Overview

### Authentication Flow

**Cookie-Based Authentication with HttpOnly Tokens**:
- Access tokens and refresh tokens are stored as HttpOnly cookies (not accessible via JavaScript)
- The backend API is configured at `NEXT_PUBLIC_API_PREFIX` (default: `http://localhost:8080`)
- Authentication is handled entirely client-side - no middleware checks
- When a 401 response is received, the system automatically attempts to refresh the token

**Token Refresh Strategy** (inspired by Dify):
- Uses `localStorage` flags to coordinate token refresh across multiple browser tabs
- Prevents concurrent refresh requests from multiple tabs
- Implements a locking mechanism with `is_other_tab_refreshing` and `last_refresh_time` keys
- The refresh endpoint (`/auth/refresh_token`) is called with native `fetch()` to avoid infinite loops
- After successful refresh, the original request is automatically retried

**Key Files**:
- `service/base.ts` - Contains `handleTokenRefresh()` and multi-tab coordination logic
- `service/fetch.ts` - HTTP client wrapper with ky, includes request/response hooks
- `service/auth.ts` - Auth service methods (logout, refreshToken)
- `middleware.ts` - Minimal middleware (no auth checks per Dify pattern)

### Service Layer Architecture

**Three-Tier Request Handling**:

1. **service/fetch.ts** - Low-level HTTP client
   - Built on `ky` with hooks for request/response interception
   - Adds `Authorization: Bearer <token>` headers automatically
   - Handles 401/403 errors in `afterResponse` hook
   - Shows toast notifications via sonner for errors
   - Returns typed responses with error handling

2. **service/base.ts** - Mid-level request wrapper
   - Wraps `fetch.ts` with `asyncRunSafe()` for error handling
   - Implements automatic token refresh on 401 errors
   - Provides `request()`, `get()`, `post()` methods
   - Handles login redirects when refresh fails
   - Supports `IOtherOptions` for fine-grained control:
     - `silent` - suppress error toasts
     - `skipRefreshToken` - prevent refresh loop
     - `needAllResponseContent` - return full Response object
     - `deleteContentType` - for file uploads

3. **service/*.ts** - Domain-specific services
   - `service/user.ts` - User data operations
   - `service/auth.ts` - Authentication operations
   - Each service uses typed request/response interfaces

**API Configuration**:
- API prefix configured in `config/path.ts` via `NEXT_PUBLIC_API_PREFIX`
- All requests automatically prepend `API_URI_PREFIX`
- Credentials mode set to `include` to send cookies

### shadcn/ui Integration

**Component Configuration** (`components.json`):
- Style: "new-york"
- Uses React Server Components (RSC)
- CSS variables for theming
- Icon library: lucide-react
- Additional registry: @aceternity

**Adding Components**:
```bash
pnpm dlx shadcn@latest add button card input
```

**Custom Components**:
- `components/ui/spinner.tsx` - Custom loading spinner using Lucide's Loader2Icon
- All other UI components are from shadcn/ui

**Toast Notifications**:
- Use `toast` from `sonner` (not `@heroui/toast`)
- `<Toaster />` is rendered in `app/layout.tsx`
- Example: `toast.error("Error message")`

### App Structure (Next.js App Router)

```
app/
├── layout.tsx        # Root layout with Providers and Toaster
├── providers.tsx     # NextThemesProvider wrapper
├── page.tsx          # Home page (user info display)
├── login/
│   └── page.tsx      # Login page with animated form
└── error.tsx         # Global error boundary
```

**Key Patterns**:
- All pages use `"use client"` directive
- SWR for data fetching with automatic revalidation
- Route protection handled client-side via API responses
- Framer Motion's `LazyMotion` with `domAnimation` for optimized animations

### Utilities

- `utils/index.ts` - `asyncRunSafe()` and `fetchWithRetry()` helpers
- `utils/var.ts` - Environment variables and constants
- `lib/utils.ts` - Tailwind className utilities (`cn()`)

### TypeScript Configuration

- Path alias: `@/*` maps to project root
- `dify-example/` directory is excluded from compilation (contains reference code)
- Strict mode enabled

## Important Conventions

1. **HTTP Requests**: Always use `service/base.ts` methods (`get`, `post`, `request`), never raw fetch
2. **Error Handling**: Use `asyncRunSafe()` wrapper for async operations
3. **Styling**: Use shadcn components with Tailwind utility classes and `cn()` helper
4. **Icons**: Prefer Lucide React icons; use @iconify/react only for brand icons
5. **Animations**: Use Framer Motion with `LazyMotion` + `domAnimation` features
6. **Forms**: Standard React form patterns (not using react-hook-form currently)

## Environment Variables

- `NEXT_PUBLIC_API_PREFIX` - Backend API URL (defaults to `http://localhost:8080`)

## Known Issues / Notes

- The `dify-example/` directory contains reference code from Dify and is excluded from builds
- ESLint warnings about import ordering and prop sorting are acceptable (configured for strict rules)
- The codebase was migrated from HeroUI to shadcn/ui - no HeroUI imports should remain
