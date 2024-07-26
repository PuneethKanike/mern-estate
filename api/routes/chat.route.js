// routes/chat.route.js
import express from 'express';
import { getMessages, addMessage } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', getMessages);  // Fetch all messages
router.post('/', addMessage);  // Add a new message

export default router;
