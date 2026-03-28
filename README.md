# Rebound — Premium 2nd Hand Book Marketplace 📚

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![Pusher](https://img.shields.io/badge/Realtime-Pusher-ff69b4?logo=pusher)](https://pusher.com/)
[![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-blue?logo=cloudinary)](https://cloudinary.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama3-orange)](https://groq.com/)

**Rebound** is a serverless-first, full-stack Next.js student marketplace for buying and selling 2nd hand textbooks. It features AI-powered price suggestions, real-time chat, and a premium glassmorphic UI — deployed edge-ready on Vercel.

---

## ✨ Features

- **📚 Book Listings** — Create, browse, and filter listings by category, condition, price and more
- **🤖 AI Price Suggestions** — Groq Llama3 estimates a fair price based on title, condition, and category
- **🔍 AI Smart Search** — Natural language search with automatic query correction
- **🖼️ AI Condition Detection** — Auto-detect book condition from uploaded photos
- **💬 Real-time Chat** — Instant messaging via Pusher between buyers and sellers
- **🔒 JWT Auth** — Secure register/login with hashed passwords
- **☁️ Cloudinary Images** — Persistent image uploads via Cloudinary (Vercel-compatible)
- **📦 Bundle Listings** — Sell multiple books as a discounted bundle
- **📱 Fully Responsive** — Premium mobile-first UI with Framer Motion animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Server Components) |
| **Styling** | Tailwind CSS 4 + Custom CSS (Glassmorphism) |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Real-time** | Pusher (Channels) |
| **Image Storage** | Cloudinary |
| **AI** | Groq API (Llama 3) |
| **Animations** | Framer Motion |
| **Deployment** | Vercel (Serverless) |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/sehaj172005/BookBazaar.git
cd BookBazaar
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the **root** of the project:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/BookBazaar

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Pusher (get from pusher.com)
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
NEXT_PUBLIC_PUSHER_CLUSTER=ap2

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI (get from console.groq.com)
GROQ_API_KEY=your_groq_key
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — everything runs from a single server.

---

## ☁️ Deploy to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all the environment variables from `.env.local` in the Vercel dashboard
4. Click **Deploy** — done!

> No separate backend needed. All API routes live in `src/app/api/` as serverless functions.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/              # Serverless API Routes (auth, books, chat, ai, requests)
│   ├── auth/             # Login & Register page
│   ├── book/[id]/        # Book detail page
│   ├── chat/             # Real-time messaging UI
│   ├── profile/          # User dashboard
│   ├── search/           # AI search results
│   └── sell/             # Create listing page
├── components/           # Reusable UI components
├── context/              # Auth context (global state)
├── lib/                  # Utilities (api.js, mongodb.js, pusher.js, ai.js)
└── models/               # Mongoose schemas (User, Book, Request, Chat)
```

---

## 🛡️ License

MIT License — see `LICENSE` for details.

---

*Built with ❤️ for the student community.*
