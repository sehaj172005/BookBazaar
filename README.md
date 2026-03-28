# Rebound — Premium Student-to-Student Marketplace 📚✨

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?logo=socket.io)](https://socket.io/)

**Rebound** is a high-performance, unified SaaS marketplace designed specifically for students to buy, sell, and trade 2nd hand textbooks and study essentials. Built with a premium, glassmorphic UI and powered by AI, it bridges the gap between students through secure, local trading.

---

## 🌟 Key Features

- **🚀 SSR Architecture**: Blazing fast initial loads and perfect SEO using Next.js 16 Server Components.
- **🧠 AI-Powered Marketplace**: Smart price suggestions and book condition detection powered by the **Groq API**.
- **⚡ Real-time Chat**: Connect with buyers and sellers instantly using **Socket.io** integration.
- **💎 Premium UI/UX**: Sleek, responsive design featuring glassmorphism, Framer Motion animations, and a unified mobile navigation system.
- **🛡️ Secure Peer-to-Peer**: Verified student listings and local meetup focused trading.

---

## 🛠️ Tech Stack

### **Frontend**
*   **Next.js 16** (App Router & Turbopack)
*   **Tailwind CSS 4** (Modern Styling)
*   **Framer Motion** (Subtle, high-end animations)
*   **Lucide React** (Consistent iconography)
*   **Sonner** (Premium notification toasts)

### **Backend & Data**
*   **Express.js** (Unified Custom Server)
*   **MongoDB + Mongoose** (NoSQL Database)
*   **Socket.io** (Real-time bidirectional communication)
*   **Multer** (Robust image upload processing)
*   **JWT** (Secure Authentication)

### **Artificial Intelligence**
*   **Groq API (Llama 3)**: Intelligent price prediction and Listing quality checks.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB instance (Local or Atlas)
- Groq Cloud API Key (for AI features)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/sehaj172005/BookBazaar.git
cd Book
npm install
```

### 3. Environment Setup
Create a `.env` file in the **root** and the **backend** folder with the following:
```env
# Backend & API
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_key


### 4. Running the Project
Launch the **Unified Server** (starts both API and Next.js):
```bash
npm start
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) to see the magic.

---

## 📂 Project Structure

```text
├── backend/            # Express.js Server & Routes
│   ├── models/         # Database Schemas (User, Book, Chat)
│   ├── routes/         # API Endpoints (Auth, Books, AI)
│   └── server.js       # Unified Entry Point
├── src/
│   ├── app/            # Next.js Pages & Layouts (App Router)
│   ├── components/     # High-end Marketplace UI Components
│   ├── context/        # Auth & Global State
│   └── lib/            # Shared Utilities (API Client)
└── package.json        # Project Orchestration
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for the student community.*
