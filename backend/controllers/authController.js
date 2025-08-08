import { google } from "googleapis";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model.js";
import axios from "axios";

dotenv.config();

export const logout = (req, res) => {
  console.log("Logging out user......");
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  });
};

export const googleLogin = async (req, res) => {

  try {
    const { token } = req.body;

    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { sub: googleId, email, name, picture } = googleResponse.data;
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, email, name, picture });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token: jwtToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Google token",
      error: error.message,
    });
  }
};
