import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getMessages, postMessage } from '../controllers/messageController.js';

const router = express.Router({ mergeParams: true });

// Message routes for a specific channel (protected by auth)
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, postMessage);

export default router;
