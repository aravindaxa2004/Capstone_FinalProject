/**
 * Channel Controller
 * Handles all channel-related operations
 */
import ChannelModel from '../models/Channel.js';
import UserModel from '../models/User.js';

/**
 * Create a new channel
 * POST /api/channels
 */
export const createChannel = async (req, res) => {
  const { name, description } = req.body;
  const creatorId = req.user.id;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Channel name is required'
    });
  }
  
  try {
    // Verify channel name is unique
    const duplicateChannel = await ChannelModel.findOne({ 
      name: name.trim().toLowerCase() 
    });
    
    if (duplicateChannel) {
      return res.status(409).json({
        success: false,
        message: 'A channel with this name already exists'
      });
    }
    
    // Create channel with creator as initial member
    const newChannel = await ChannelModel.create({
      name: name.trim(),
      description: description || '',
      createdBy: creatorId,
      members: [creatorId]
    });
    
    // Add channel to user's joined list
    await UserModel.findByIdAndUpdate(creatorId, {
      $addToSet: { joinedChannels: newChannel._id }
    });
    
    return res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      data: newChannel
    });
    
  } catch (error) {
    console.error('Create channel error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create channel'
    });
  }
};

/**
 * Get all public channels
 * GET /api/channels/public
 */
export const getPublicChannels = async (req, res) => {
  try {
    const channelList = await ChannelModel.find()
      .select('-members')
      .sort({ createdAt: -1 })
      .lean();
    
    return res.status(200).json({
      success: true,
      message: 'Channels retrieved successfully',
      data: channelList
    });
    
  } catch (error) {
    console.error('Fetch channels error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve channels'
    });
  }
};

/**
 * Subscribe to a channel
 * POST /api/channels/:id/subscription
 */
export const subscribeChannel = async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user.id;
  
  try {
    const targetChannel = await ChannelModel.findById(channelId);
    
    if (!targetChannel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }
    
    // Add user to channel members
    await ChannelModel.findByIdAndUpdate(channelId, {
      $addToSet: { members: userId }
    });
    
    // Add channel to user's list
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { joinedChannels: channelId }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to channel'
    });
    
  } catch (error) {
    console.error('Subscribe error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe to channel'
    });
  }
};

/**
 * Get channel details with members
 * GET /api/channels/:id
 */
export const getChannelById = async (req, res) => {
  const channelId = req.params.id;
  
  try {
    const channelData = await ChannelModel.findById(channelId)
      .populate('members', 'username email')
      .populate('createdBy', 'username')
      .lean();
    
    if (!channelData) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Channel details retrieved',
      data: channelData
    });
    
  } catch (error) {
    console.error('Get channel error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve channel details'
    });
  }
};

/**
 * Unsubscribe from a channel
 * DELETE /api/channels/:id/subscription
 */
export const unsubscribeChannel = async (req, res) => {
  const channelId = req.params.id;
  const userId = req.user.id;
  
  try {
    // Remove user from channel
    await ChannelModel.findByIdAndUpdate(channelId, {
      $pull: { members: userId }
    });
    
    // Remove channel from user's list
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { joinedChannels: channelId }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from channel'
    });
    
  } catch (error) {
    console.error('Unsubscribe error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from channel'
    });
  }
};
