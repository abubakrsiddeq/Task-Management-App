# TaskFlow (Modern Kanban Workspace)

🚀 **Live Demo:** [https://task-management-uptech.vercel.app](https://task-management-uptech.vercel.app)

TaskFlow is a premium, full-stack Kanban task management system built with Next.js App Router, TypeScript, MongoDB, Mongoose, JWT cookie authentication, Tailwind CSS, and ShadCN-style UI primitives. It features a vibrant dark-mode glassmorphic aesthetic and a seamless drag-and-drop experience.

## Features

- **Modern Authentication**: User signup, login, logout, and session restoration using HTTP-only JWT cookies.
- **Kanban Board**: Fully interactive drag-and-drop interface across 4 columns (Backlog, In Progress, Review, Done).
- **Task Management**: Create, edit, and reorganize tasks instantly. Tasks support priority flags, due dates, and specific project labels.
- **Dynamic User Profile**: Update your full name and password seamlessly through a beautifully styled Dropdown Menu and Dialog interface.
- **Premium UI**: Vibrant, deep-dark glassmorphic design featuring ambient background gradients, hover elevations, micro-animations, loading skeletons, and toast feedback.
- **Route Protection**: Protected dashboard route guard using Next.js `middleware.ts`.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- MongoDB with Mongoose
- `jose` for JWT signing and verification
- `bcryptjs` for password hashing
- Tailwind CSS v4
- React Hook Form + Zod
- `@hello-pangea/dnd` for fluid drag-and-drop
- Radix UI & Shadcn UI Primitives
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
    profile/
      route.ts
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
    profile-form-dialog.tsx
    task-dashboard.tsx
    task-form-dialog.tsx
  ui/
    button.tsx
    dialog.tsx
    dropdown-menu.tsx
    input.tsx
    label.tsx
    skeleton.tsx
    textarea.tsx
hooks/
  use-debounced-value.ts
lib/
  api.ts
  auth/
    session.ts
  constants.ts
  db.ts
  serializers.ts
  types.ts
  utils.ts
  validations/
    auth.ts
    task.ts
models/
  Task.ts
  User.ts
middleware.ts
```

## Environment Variables

Create a `.env` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: A long, random string used to sign auth tokens

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

## API Overview

### Auth & Profile Routes
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/profile` (Update name and password)

### Task Routes
- `GET /api/tasks?status=all|backlog|in-progress|review|done&q=search`
- `POST /api/tasks`
- `PATCH /api/tasks/[taskId]`
- `DELETE /api/tasks/[taskId]`

## Key Architecture Notes

### Authentication & Profile
- Passwords are hashed with `bcryptjs`.
- JWT tokens are signed with `jose` and stored in an HTTP-only cookie.
- Route access is guarded in `middleware.ts`.

### Data Models
- `models/User.ts`: Stores user identity and hashed password.
- `models/Task.ts`: Stores user-linked task records including column status, priority, label, due date, completion state, and drag-and-drop position order.

### Validation
- Client forms use React Hook Form with Zod resolvers.
- Route handlers re-validate all incoming payloads on the server.

### Database Connection
- `lib/db.ts` reuses a cached Mongoose connection to avoid duplicate connections during development.
