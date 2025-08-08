import express from 'express';
import { googleLogin, logout } from '../controllers/authController.js';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();


// Logout
router.get('/logout', logout);

router.post('/google-login',googleLogin);

export default router;