/**
 * Message Routes
 * Handles message retrieval and posting
 */
import express from 'express';
import validateToken from '../middleware/authMiddleware.js';
import { getMessages, postMessage } from '../controllers/messageController.js';

const messageRouter = express.Router({ mergeParams: true });

// Get channel messages
messageRouter.get('/:id/messages', validateToken, getMessages);

// Post new message
messageRouter.post('/:id/messages', validateToken, postMessage);

export default messageRouter;
