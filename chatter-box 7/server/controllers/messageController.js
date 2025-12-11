import Message from '../models/Message.js';

// Get all messages for a specific channel, with sender info
export const getMessages = async (req, res) => {
  const { id: channelId } = req.params;

  try {
    const messages = await Message.find({ channelId })
      .populate('sender', 'username')
      .sort('timestamp')
      .lean();

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages || []
    });
  } catch (err) {
    console.error("Error in getMessages:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching messages"
    });
  }
};

// Post a new message to a channel
export const postMessage = async (req, res) => {
  const { id: channelId } = req.params;
  const { content } = req.body;

  try {
    const message = await Message.create({
      content,
      sender: req.user.id,
      channelId
    });

    await message.populate('sender', 'username');

    return res.status(201).json({
      success: true,
      message: "Message posted successfully",
      data: message
    });
  } catch (err) {
    console.error("Error in postMessage:", err.message);
    return res.status(400).json({
      success: false,
      message: "Failed to post message"
    });
  }
};
