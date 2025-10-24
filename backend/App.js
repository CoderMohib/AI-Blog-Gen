const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cookieParser = require("cookie-parser");
const { initializeSocket } = require("./socket");
const App = express();
require('dotenv').config()
const path = require("path");
const http = require('http');

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
App.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173","https://ai-blog-gen-zeta.vercel.app"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
}));
App.use(express.json());
App.use(cookieParser());
App.use("/", userRoutes);
App.use("/", notificationRoutes);
App.use("/public", express.static(path.join(__dirname, "public")));

connectDB()
  .then(() => {
    const server = http.createServer(App);
    
    // Initialize Socket.io
    initializeSocket(server);
    
    server.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
