const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const App = express();
require('dotenv').config()
const path = require("path");
App.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
App.use(express.json());
App.use(cookieParser());
App.use("/", userRoutes);
App.use("/public", express.static(path.join(__dirname, "public")));

connectDB()
  .then(() => {
    App.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
