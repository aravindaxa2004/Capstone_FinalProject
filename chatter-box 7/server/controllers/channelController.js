import Channel from '../models/Channel.js';
import User from '../models/User.js';

// --------------------------------------------------
// Create a new channel and add creator as a member
// --------------------------------------------------
export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Channel.findOne({ name });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Channel name already exists"
      });
    }

    const channel = await Channel.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { joinedChannels: channel._id }
    });

    return res.status(201).json({
      success: true,
      message: "Channel created successfully",
      data: channel
    });
  } catch (err) {
    console.error("Error in createChannel:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// --------------------------------------------------
// Get list of public channels (excluding members)
// --------------------------------------------------
export const getPublicChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .select('-members')
      .sort('-createdAt')
      .lean();

    return res.status(200).json({
      success: true,
      message: "Channels fetched successfully",
      data: channels
    });
  } catch (err) {
    console.error("Error in getPublicChannels:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching channels"
    });
  }
};

// --------------------------------------------------
// Add current user to channel members and vice versa
// --------------------------------------------------
export const subscribeChannel = async (req, res) => {
  try {
    const { id } = req.params;

    await Channel.findByIdAndUpdate(id, {
      $addToSet: { members: req.user.id }
    });

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { joinedChannels: id }
    });

    return res.status(200).json({
      success: true,
      message: "Joined channel successfully"
    });
  } catch (err) {
    console.error("Error in joinChannel:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// --------------------------------------------------
// Get channel details including member usernames
// --------------------------------------------------
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('members', 'username')
      .lean();

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Channel fetched successfully",
      data: channel
    });
  } catch (err) {
    console.error("Error in getChannelById:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching channel"
    });
  }
};

// --------------------------------------------------
// Unsubscribe user from channel
// --------------------------------------------------
export const unsubscribeChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user.id;

    await Channel.findByIdAndUpdate(channelId, {
      $pull: { members: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { joinedChannels: channelId }
    });

    return res.status(200).json({
      success: true,
      message: "Successfully left the channel"
    });
  } catch (err) {
    console.error("Error in unsubscribeChannel:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while leaving channel"
    });
  }
};
