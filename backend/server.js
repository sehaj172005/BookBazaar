const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const next = require("next");

dotenv.config({ path: path.join(__dirname, ".env") });

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../") });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // More flexible for unified origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Production security & logging
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP for combined dev/prod flexibility unless strictly needed
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Debug logging for routing
app.use((req, res, next) => {
  if (!req.url.startsWith("/_next") && !req.url.includes(".")) {
    console.log(`🔍 [ROUTING] ${req.method} ${req.url}`);
  }
  next();
});

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use("/api/auth/", limiter); 

// Middleware
app.use(cors({ origin: true, credentials: true })); // Allow same origin easily
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Attach IO to app for use in routes if needed
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`👤 User joined chat room: ${chatId}`);
  });

  socket.on("send_message", (data) => {
    // broadcast to everyone in the room except sender
    socket.to(data.chatId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/ai", require("./routes/ai"));

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ message: "BookBazaar API running 🚀", status: "OK" });
});

// Next.js Catch-all (placed after all other routes)
app.use((req, res) => {
  return handle(req, res);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err.status || 500, err.message);
  if (err.stack) console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: "Something went wrong", 
    error: err.message,
    status: err.status || 500
  });
});

// Connect DB + Start
const PORT = process.env.PORT || 10000;

nextApp.prepare().then(() => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
      server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
});
