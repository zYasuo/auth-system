# 🔐 Next.js Authentication System

A complete authentication system with password reset functionality built with Next.js 15, Prisma, and Resend.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma)

## ✨ Features

- **User Registration & Login** with secure password hashing (Argon2)
- **JWT Authentication** with access/refresh tokens
- **Password Reset** via email with Resend integration
- **Responsive UI** built with shadcn/ui components
- **Clean Architecture** with Controller-Service-Repository pattern

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Resend** - Email service
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Zod** - Validation

## 🛠️ Setup

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Create `.env.local`:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
\`\`\`

### 3. Database Setup
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
├── app/
│   ├── (ui)/              # Auth pages (signin, signup, forgot-password, reset-password)
│   └── api/auth/          # Auth API routes
├── components/ui/         # shadcn/ui components
├── controller/            # Request handlers
├── services/              # Business logic
├── repositories/          # Database access
├── lib/                   # Utilities (JWT, email, Prisma)
└── hooks/                 # Custom React hooks
\`\`\`

## 🔑 API Endpoints

- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

## 🎨 Pages

- `/signin` - Login page
- `/signup` - Registration page
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token
- `/user` - Protected user dashboard

## 🔒 Security Features

- Argon2 password hashing
- JWT tokens with HTTP-only cookies
- Password complexity validation
- Token expiration and cleanup
- Input validation with Zod

## 📧 Email Integration

Uses Resend for sending password reset emails with HTML templates.

## 🚀 Deployment

Deploy to Vercel:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

---

Made with ❤️ using Next.js
