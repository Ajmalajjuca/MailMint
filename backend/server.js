import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import morgan from 'morgan';
import cron from "node-cron";

dotenv.config();


import "./config/passport.js"; // Ensure passport is configured

import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/mailRoutes.js";
import axios from "axios";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // or '*', but only for testing
  credentials: true,
}));

app.use(morgan('dev')); // Logging middleware for development


cron.schedule("*/14 * * * *", async () => {
  try {
    const response = await axios.get(`${process.env.BACKEND_URL}/health`);
    console.log(`[CRON] /health status:`, response.data);
  } catch (error) {
    console.error("[CRON] Error calling /health:", error.message);
  }
});

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey', // You should use an env variable
  resave: false,                     // Prevents saving session if unmodified
  saveUninitialized: false,         // Prevents saving empty sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24     // Optional: Session expires in 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Middleware to handle errors globally
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});


// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);

// DB + Start server
mongoose
  .connect(process.env.MONGODB_URI)
    .then(() => ("MongoDB connected"))
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB Error:", err));
