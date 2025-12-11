import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Handle user registration
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? "Email already registered"
          : "Username already taken"
      });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create and save the new user
    const user = await User.create({ username, email, password: hash });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Error in register:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while registering user"
    });
  }
};

// Handle user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email }
      }
    });
  } catch (err) {
    console.error("Error in login:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error while logging in"
    });
  }
};