# HR-Assist Development Standards

## 1. Project Philosophy

- **KISS & DRY**: If logic is duplicated, abstract it. If a solution is complex, simplify it.
- **SOLID**: Strict adherence to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **Language**: English is mandatory for all code, comments, documentation, and commit messages. Polish is reserved for UI strings only.
- **Optimized Performance**: Code must be efficient. Avoid unnecessary re-renders in React and inefficient DB queries in Prisma.

## 2. Backend (NestJS, TypeScript, PostgreSQL, Prisma)

- **Layered Architecture**: Controller (routing) -> Service (business logic) -> Repository/Prisma (data access).
- **Controller Constraints**: Logic is forbidden in controllers. They must only delegate to services.
- **Data Integrity**: `class-validator` and `class-transformer` are mandatory for all DTOs.
- **Security & Error Handling**:
  - Global `ExceptionFilter` for standardized API responses.
  - Interceptor-based `ResponseWrapper` for consistent data structures.
  - JWT for authentication.
- **Maintainability**: Centralized structured logging (Pino/Winston). No `console.log`.
- **Maintenance CLI**: Use `commander` for internal system tasks (user management, etc.).

## 3. Frontend (Next.js 16+, Tailwind CSS, TypeScript)

- **Component Design**: Atomic composition. No "God components". Max component length: 150 lines.
- **State & Data**: TanStack Query (React Query) for server-state management. No raw `useEffect` API fetching.
- **Styling**: Tailwind CSS only. Maintain utility-first, semantic class structure.

## 4. Operational & Deployment (Docker)

- **Containerization**: Must be bootable via `docker-compose up --build` from root.
- **Architecture**:
  - `web` (Next.js) - port 3000
  - `api` (NestJS) - port 3001
  - `db` (Postgres)
- **Networking**: Services must communicate using internal service names (e.g., `http://api:3001`).

## 5. The "Safety Cage" (Negative Constraints)

- **NO Logic in Controllers**: Controllers must only handle request validation and delegation.
- **NO Inline Queries**: Use Prisma Client properly via service/repository methods.
- **NO Magic Strings/Numbers**: Define all configuration in constants or environment variables.
- **NO "Any" types**: Strict typing is required. If a type cannot be defined, the architecture is flawed.
- **NO "// @ts-ignore"**: If the compiler complains, fix the architecture.
- **NO Boilerplate**: Generate only necessary, lean code.
- **Naming**: Use descriptive, intention-revealing names.

## 6. Execution Rules

- Always verify changes against the `docker-compose` setup.
- If a task involves new DB entities, update `schema.prisma` first, then generate Prisma client, then update DTOs.
- Maintain consistency between backend DTOs and frontend interfaces.
