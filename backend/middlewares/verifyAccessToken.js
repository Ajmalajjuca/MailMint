// src/middlewares/verifyAccessToken.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.token = token; // Store the token in the request for later use

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyAccessToken };
