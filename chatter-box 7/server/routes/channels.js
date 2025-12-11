/**
 * Channel Routes
 * Handles channel CRUD operations
 */
import express from 'express';
import validateToken from '../middleware/authMiddleware.js';
import {
  createChannel,
  getPublicChannels,
  subscribeChannel,
  getChannelById,
  unsubscribeChannel
} from '../controllers/channelController.js';

const channelRouter = express.Router();

// All routes require authentication
channelRouter.post('/', validateToken, createChannel);
channelRouter.get('/public', validateToken, getPublicChannels);
channelRouter.post('/:id/subscription', validateToken, subscribeChannel);
channelRouter.get('/:id', validateToken, getChannelById);
channelRouter.delete('/:id/subscription', validateToken, unsubscribeChannel);

export default channelRouter;
