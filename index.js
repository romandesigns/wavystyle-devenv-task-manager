require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const { createClient } = require("redis");
const { Server } = require("socket.io");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Redis client
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient
  .connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch((err) => console.error("❌ Redis error:", err));

// Socket.IO setup
setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
