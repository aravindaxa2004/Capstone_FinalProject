/**
 * Message Model Schema
 * Defines the structure for chat messages within channels
 */
import mongoose from 'mongoose';

const messageDefinition = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content cannot be empty'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender information is required']
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel reference is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient message retrieval by channel
messageDefinition.index({ channelId: 1, timestamp: 1 });

const MessageModel = mongoose.model('Message', messageDefinition);

export default MessageModel;
