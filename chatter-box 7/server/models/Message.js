import mongoose from 'mongoose';

// Message schema definition
const messageSchema = new mongoose.Schema({
  content:   { type: String, required: true }, // Message text
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender's user ID
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true }, // Channel the message belongs to
  timestamp: { type: Date, default: Date.now } // Time the message was sent
});

const Message = mongoose.model('Message', messageSchema);

export default Message;