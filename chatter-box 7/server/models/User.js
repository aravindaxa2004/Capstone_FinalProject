/**
 * User Model Schema
 * Defines the structure for user accounts in the system
 */
import mongoose from 'mongoose';

const userDefinition = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is mandatory'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must contain at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is mandatory'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is mandatory'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  joinedChannels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }]
}, {
  timestamps: true
});

const UserModel = mongoose.model('User', userDefinition);

export default UserModel;
