import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createChannel,
  getPublicChannels,
  subscribeChannel,
  getChannelById,
  unsubscribeChannel
} from '../controllers/channelController.js';

const router = express.Router();

// Channel routes (all protected by auth middleware)
router.post('/', auth, createChannel);
router.get('/public', auth, getPublicChannels);
router.post('/:id/subscription', auth, subscribeChannel);
router.get('/:id', auth, getChannelById);
router.delete('/:id/subscription', auth, unsubscribeChannel); 

export default router;