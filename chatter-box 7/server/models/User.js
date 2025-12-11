import mongoose from 'mongoose';

// User schema definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username
  email:    { type: String, required: true, unique: true }, // Unique email address
  password: { type: String, required: true }, // Hashed password
  joinedChannels: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' } // Channels the user has joined
  ]
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

export default User;