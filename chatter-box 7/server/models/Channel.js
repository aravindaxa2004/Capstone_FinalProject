/**
 * Channel Model Schema
 * Defines the structure for chat channels/rooms
 */
import mongoose from 'mongoose';

const channelDefinition = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Channel name is mandatory'],
    unique: true,
    trim: true,
    maxlength: [50, 'Channel name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: ''
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Channel creator is required']
  }
}, {
  timestamps: true
});

const ChannelModel = mongoose.model('Channel', channelDefinition);

export default ChannelModel;
