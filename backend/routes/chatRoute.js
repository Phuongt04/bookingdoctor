// File: backend/routes/chatRoute.js
import express from 'express';
import { chatBot } from '../controllers/chatController.js';

const chatRouter = express.Router();

// Định nghĩa đường dẫn gửi tin nhắn
// API sẽ là: POST /api/chat/
chatRouter.post('/', chatBot); 

export default chatRouter;