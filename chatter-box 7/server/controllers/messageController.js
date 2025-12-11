/**
 * Message Controller
 * Handles message retrieval and posting
 */
import MessageModel from '../models/Message.js';

/**
 * Retrieve all messages for a channel
 * GET /api/channels/:id/messages
 */
export const getMessages = async (req, res) => {
  const channelId = req.params.id;
  
  try {
    const messageList = await MessageModel.find({ channelId })
      .populate('sender', 'username')
      .sort({ timestamp: 1 })
      .lean();
    
    return res.status(200).json({
      success: true,
      message: 'Messages retrieved successfully',
      data: messageList || []
    });
    
  } catch (error) {
    console.error('Fetch messages error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages'
    });
  }
};

/**
 * Post a new message to a channel
 * POST /api/channels/:id/messages
 */
export const postMessage = async (req, res) => {
  const channelId = req.params.id;
  const senderId = req.user.id;
  const { content } = req.body;
  
  // Validate message content
  if (!content || content.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Message content cannot be empty'
    });
  }
  
  try {
    // Create new message
    const newMessage = await MessageModel.create({
      content: content.trim(),
      sender: senderId,
      channelId,
      timestamp: new Date()
    });
    
    // Populate sender information
    await newMessage.populate('sender', 'username');
    
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('Post message error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};
