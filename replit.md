# Overview

Tettrix is a professional IT services website built with a modern full-stack architecture. The application showcases IT services including website design, system administration, and security solutions. It features a React frontend with TypeScript, an Express.js backend, and is configured for PostgreSQL database integration using Drizzle ORM, though it can run without a database for development purposes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Component System**: Radix UI primitives for accessible, unstyled components

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful API design with `/api` routes
- **Development Setup**: Hot reload with tsx for TypeScript execution
- **Build Process**: esbuild for server bundling, Vite for client bundling

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migration Strategy**: Drizzle Kit for database migrations stored in `/migrations`
- **Fallback**: Application can run without database using placeholder credentials

## Development Environment
- **Monorepo Structure**: Client and server code in separate directories with shared types
- **Path Aliases**: Configured aliases for cleaner imports (@, @shared, @assets)
- **Hot Reload**: Concurrent development with Vite dev server and Express server
- **Proxy Setup**: Vite proxies `/api` requests to Express server on port 5000

## Styling System
- **CSS Framework**: Tailwind CSS with custom configuration
- **Design System**: shadcn/ui with "new-york" style variant
- **Theme Support**: CSS custom properties for light/dark mode
- **Component Styling**: Class Variance Authority for component variants

# External Dependencies

## Database
- **Primary**: PostgreSQL with Neon Database serverless driver
- **Connection**: Environment-based DATABASE_URL configuration
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

## UI Libraries
- **Component Library**: shadcn/ui built on Radix UI primitives
- **Icons**: Font Awesome 6.4.0 for iconography
- **Fonts**: Google Fonts (Inter) for typography
- **Animations**: Embla Carousel for interactive components

## Development Tools
- **Build Tools**: Vite, esbuild, Tailwind CSS
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier (implied by shadcn/ui setup)
- **Replit Integration**: Vite plugin for runtime error overlay and cartographer

## Runtime Dependencies
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation
- **Utilities**: clsx for conditional classes, cmdk for command interfaces
- **Cross-platform**: cross-env for environment variable handling