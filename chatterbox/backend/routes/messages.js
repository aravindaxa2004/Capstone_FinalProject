const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Channel = require('../models/Channel');
const { protect } = require('../middleware/auth');

// @route   GET /api/channels/:id/messages
// @desc    Get all messages in a channel
// @access  Private
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is a member of the channel
    if (!channel.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must join this channel to view messages' });
    }

    // Get messages with pagination (default last 100 messages)
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const messages = await Message.find({ channelId: req.params.id })
      .populate('sender', 'username')
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit);

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/channels/:id/messages
// @desc    Send a message in a channel
// @access  Private
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is a member of the channel
    if (!channel.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'You must join this channel to send messages' });
    }

    // Create message
    const message = await Message.create({
      content: content.trim(),
      sender: req.user._id,
      channelId: req.params.id,
      timestamp: new Date()
    });

    // Populate sender info
    await message.populate('sender', 'username');

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
