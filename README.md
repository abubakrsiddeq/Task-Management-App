# TaskFlow

TaskFlow is a full-stack task management system built with Next.js App Router, TypeScript, MongoDB, Mongoose, JWT cookie authentication, Tailwind CSS, and ShadCN-style UI primitives.

## Features

- User signup, login, logout, and session restoration
- HTTP-only JWT cookie authentication
- Protected dashboard route guard using Next.js `proxy.ts`
- Create, edit, delete, search, filter, and complete tasks
- Priority badges, due dates, loading skeletons, empty states, and toast feedback
- Responsive SaaS-style UI for mobile, tablet, and desktop

## Tech Stack

- Next.js 16 App Router
- TypeScript
- MongoDB with Mongoose
- `jose` for JWT signing and verification
- `bcryptjs` for password hashing
- Tailwind CSS v4
- React Hook Form + Zod
- Sonner toasts

## Folder Structure

```text
app/
  (auth)/
    login/page.tsx
    signup/page.tsx
  api/
    auth/
      login/route.ts
      logout/route.ts
      me/route.ts
      signup/route.ts
    tasks/
      [taskId]/route.ts
      route.ts
  dashboard/
    loading.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  auth/
    auth-form.tsx
  tasks/
    task-dashboard.tsx
    task-form-dialog.tsx
  ui/
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
    label.tsx
    separator.tsx
    skeleton.tsx
    textarea.tsx
hooks/
  use-debounced-value.ts
lib/
  api.ts
  auth.ts
  constants.ts
  db.ts
  env.ts
  serializers.ts
  types.ts
  utils.ts
  validations/
    auth.ts
    task.ts
models/
  Task.ts
  User.ts
proxy.ts
```

## Environment Variables

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Guidance:

- `MONGODB_URI`: MongoDB Atlas or self-hosted connection string
- `JWT_SECRET`: a long, random string used to sign auth tokens

You can copy from `.env.example` as a starting point.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with your MongoDB URI and JWT secret.

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## API Overview

### Auth routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Task routes

- `GET /api/tasks?status=all|pending|completed&q=search`
- `POST /api/tasks`
- `PATCH /api/tasks/[taskId]`
- `DELETE /api/tasks/[taskId]`

## Key Architecture Notes

### Authentication

- Passwords are hashed with `bcryptjs` before storage.
- JWT tokens are signed with `jose`.
- Tokens are stored in an HTTP-only cookie for better security.
- Route access is guarded in `proxy.ts`, which is the Next.js 16 replacement for the old middleware convention.

### Data models

- `models/User.ts` stores user identity and hashed password.
- `models/Task.ts` stores user-linked task records including priority, due date, completion state, and order.

### Validation

- Client forms use React Hook Form with Zod resolvers.
- Route handlers re-validate all incoming payloads on the server.

### Database connection

- `lib/db.ts` reuses a cached Mongoose connection to avoid duplicate connections during development.

## Verification

The project has been verified with:

```bash
npm run lint
npm run build
```
