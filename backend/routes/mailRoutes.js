import express from 'express';
import {
  generateEmailContent,
  sendGeneratedEmail,
    getSentEmails,
} from '../controllers/mailController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';

const router = express.Router();

router.post('/generate', verifyAccessToken, generateEmailContent);
router.post('/send', verifyAccessToken, sendGeneratedEmail);
router.get('/sent', verifyAccessToken, getSentEmails);


export default router;
