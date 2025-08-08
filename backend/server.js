import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import morgan from 'morgan';

dotenv.config();


import "./config/passport.js"; // Ensure passport is configured

import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/mailRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // or '*', but only for testing
  credentials: true,
}));

app.use(morgan('dev')); // Logging middleware for development


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
