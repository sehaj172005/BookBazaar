const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/books", require("./routes/books"));
app.use("/requests", require("./routes/requests"));
app.use("/chat", require("./routes/chat"));
app.use("/profile", require("./routes/profile"));
app.use("/ai", require("./routes/ai"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "BookBazaar API running 🚀", status: "OK" });
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
const PORT = process.env.PORT || 5000;

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
