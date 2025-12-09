const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/channels
// @desc    Create a new channel
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    // Check if channel name already exists
    const channelExists = await Channel.findOne({ name: name.trim() });
    if (channelExists) {
      return res.status(400).json({ message: 'Channel name already exists' });
    }

    // Create channel with creator as first member
    const channel = await Channel.create({
      name: name.trim(),
      description: description || '',
      members: [req.user._id],
      createdBy: req.user._id
    });

    // Add channel to user's joined channels
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedChannels: channel._id }
    });

    // Populate creator info
    await channel.populate('createdBy', 'username');
    await channel.populate('members', 'username');

    res.status(201).json(channel);
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/channels/public
// @desc    Get all public channels
// @access  Private
router.get('/public', protect, async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate('createdBy', 'username')
      .populate('members', 'username')
      .sort({ createdAt: -1 });

    res.json(channels);
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/channels/my-channels
// @desc    Get channels the user has joined
// @access  Private
router.get('/my-channels', protect, async (req, res) => {
  try {
    const channels = await Channel.find({ members: req.user._id })
      .populate('createdBy', 'username')
      .populate('members', 'username')
      .sort({ createdAt: -1 });

    res.json(channels);
  } catch (error) {
    console.error('Get my channels error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/channels/:id/join
// @desc    Join a channel
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is already a member
    if (channel.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this channel' });
    }

    // Add user to channel members
    channel.members.push(req.user._id);
    await channel.save();

    // Add channel to user's joined channels
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { joinedChannels: channel._id }
    });

    await channel.populate('createdBy', 'username');
    await channel.populate('members', 'username');

    res.json(channel);
  } catch (error) {
    console.error('Join channel error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/channels/:id/leave
// @desc    Leave a channel
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is a member
    if (!channel.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are not a member of this channel' });
    }

    // Remove user from channel members
    channel.members = channel.members.filter(
      member => member.toString() !== req.user._id.toString()
    );
    await channel.save();

    // Remove channel from user's joined channels
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { joinedChannels: channel._id }
    });

    res.json({ message: 'Left channel successfully' });
  } catch (error) {
    console.error('Leave channel error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/channels/:id
// @desc    Get channel details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('members', 'username email');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
