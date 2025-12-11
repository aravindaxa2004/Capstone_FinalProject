/**
 * Authentication Controller
 * Handles user registration and login operations
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

/**
 * Register a new user account
 * POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: username, email, password'
    });
  }
  
  try {
    // Check for existing account with same credentials
    const existingAccount = await UserModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });
    
    if (existingAccount) {
      const conflictField = existingAccount.email === email.toLowerCase() 
        ? 'Email address' 
        : 'Username';
      return res.status(400).json({
        success: false,
        message: `${conflictField} is already in use`
      });
    }
    
    // Generate password hash
    const saltRounds = 12;
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, passwordSalt);
    
    // Create new user record
    const newUser = await UserModel.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
    
  } catch (serverError) {
    console.error('Registration error:', serverError.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
};

/**
 * Authenticate user and issue JWT token
 * POST /api/auth/login
 */
export const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  try {
    // Find user by email
    const userAccount = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (!userAccount) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, userAccount.password);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const tokenPayload = { id: userAccount._id };
    const accessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        token: accessToken,
        user: {
          id: userAccount._id,
          username: userAccount.username,
          email: userAccount.email
        }
      }
    });
    
  } catch (serverError) {
    console.error('Login error:', serverError.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication'
    });
  }
};
