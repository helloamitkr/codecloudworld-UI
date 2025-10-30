---
slug: "nextjs-notes-app"
title: "Next.js Notes App"
stack: ["Next.js", "Prisma", "SQLite", "Tailwind"]
description: "A simple notes app with auth, CRUD, and search."
github: "https://github.com/example/nextjs-notes-app"
demo: "https://demo.example.com/nextjs-notes-app"
difficulty: "Beginner"
category: "Full Stack"
---

# Next.js Notes App

A clean and simple notes application built with Next.js, featuring user authentication, full CRUD operations, and powerful search functionality.

## Features

- **User Authentication** - Secure login and registration
- **Create & Edit Notes** - Rich text editor with markdown support
- **Search & Filter** - Find notes quickly with full-text search
- **Categories & Tags** - Organize notes with custom categories
- **Responsive Design** - Works perfectly on all devices
- **Dark Mode** - Toggle between light and dark themes

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS for modern UI
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recommended)

## Screenshots

```
┌─────────────────────────────────────┐
│  📝 My Notes                    🔍  │
├─────────────────────────────────────┤
│                                     │
│  📄 Meeting Notes                   │
│  📅 Today, 2:30 PM                 │
│  💭 Discussed project timeline...  │
│                                     │
│  📄 Recipe Ideas                    │
│  📅 Yesterday, 5:15 PM             │
│  🍳 Try the new pasta recipe...    │
│                                     │
└─────────────────────────────────────┘
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/example/nextjs-notes-app
cd nextjs-notes-app

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Database Schema

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  notes Note[]
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  category  String?
  tags      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

## Key Features Implementation

### Search Functionality
```javascript
// Full-text search with Prisma
const searchNotes = async (query) => {
  return await prisma.note.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { updatedAt: 'desc' }
  });
};
```

### Rich Text Editor
- Markdown support with live preview
- Syntax highlighting for code blocks
- Auto-save functionality
- Keyboard shortcuts

## Learning Outcomes

- Next.js App Router and Server Components
- Database design with Prisma
- Authentication flows with NextAuth.js
- Responsive design with Tailwind CSS
- State management in React
- API route handling

Perfect for beginners learning full-stack development with modern React!
