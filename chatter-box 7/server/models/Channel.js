import mongoose from 'mongoose';

// Channel schema definition
const channelSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true }, // Channel name (must be unique)
  description: { type: String }, // Optional description
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // List of user IDs
  ],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Creator of the channel
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;