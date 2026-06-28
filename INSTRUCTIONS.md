```markdown
# HR-Assist Development Standards (Master Manifest)

## 1. Core Philosophy

- **Toyota Hilux Standard**: Code must be reliable, predictable, and robust. Prioritize maintainability and stability over fancy features.
- **English-First**: All code, filenames, logic, comments, and commit messages MUST be in English. Only UI strings (user-facing) are in Polish.
- **KISS & DRY**: If it's complex, simplify it. If it's duplicated, abstract it.
- **Long-term Value**: Write code so that any future developer (human or AI) can understand the structure in minutes. Zero technical debt allowed.

## 2. Backend (NestJS + Prisma + TypeScript)

- **Architecture**: Layered approach (Controller -> Service -> Repository/Prisma).
- **Controller Layer**: Minimalist. ONLY handles route mapping and delegating to services. NO business logic.
- **Security**:
  - Password Hashing: Argon2id (Strictly).
  - SQL Injection: Use Prisma ORM methods exclusively. No raw queries.
  - Authentication: Simple JWT-based stateless auth.
- **Validation**: Strict use of `class-validator` and `class-transformer` for all DTOs.
- **Logging**: Use `nestjs-pino` with JSON output. Logs directed to `/api/logs/app.log` (mounted as Docker volume).
- **Maintenance**: Implement a CLI using `commander` for administrative tasks (password resets, log viewing, etc.).

## 3. Frontend (Next.js 16+ + Tailwind CSS)

- **Design Philosophy**: Minimalist UI, high accessibility. If a user needs a manual, the UI is wrong.
- **State Management**: Use TanStack Query (React Query) for API interaction.
- **Tech**: Axios for API client with interceptors for JWT. No raw `useEffect` fetches.
- **Auth Flow**: Two states: Unauthenticated (Login Screen) and Authenticated (Dashboard). Logout functionality is required.
- **Reliability**: All forms must have client-side and server-side validation.

## 4. Infrastructure & Deployment (Docker)

- **Single Command**: System must be bootable via `docker-compose up --build`.
- **Containers**:
  - `web` (Next.js)
  - `api` (NestJS)
  - `db` (Postgres)
- **Networking**: Internal communication via service names.

## 5. Security & Data Protection (RODO Compliance)

- **Zero Plain-text**: No passwords or sensitive data in plain text in logs or DB.
- **Sanitization**: All inputs are sanitized.
- **Error Handling**: Standardized `ExceptionFilter`. Do not expose internal stack traces to the user.
- **Data Privacy**: All data resides locally on the company-owned server.

## 6. The "Safety Cage" (Negative Constraints)

- **NO Role-Based Access Control**: Simple flat authentication for MVP.
- **NO God Components**: Max component length: 150 lines. Break down complex UIs.
- **NO "Any" Types**: Strict typing is non-negotiable.
- **NO Legacy Syntax**: Use modern stable ES2024 features.
- **NO Quick Fixes**: No `// @ts-ignore`. If it fails, fix the underlying architecture.
```
