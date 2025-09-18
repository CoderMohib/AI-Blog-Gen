const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connect");
const userRoutes = require("./routes/userRoutes");
const App = express();
require('dotenv').config()

App.use(cors());
App.use(express.json());
App.use("/", userRoutes);
connectDB()
  .then(() => {
    App.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
