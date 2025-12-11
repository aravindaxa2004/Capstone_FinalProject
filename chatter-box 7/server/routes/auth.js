/**
 * Authentication Routes
 * Handles user registration and login endpoints
 */
import express from 'express';
import { registerUser, authenticateUser } from '../controllers/authController.js';

const authRouter = express.Router();

// Register new account
authRouter.post('/register', registerUser);

// Login to existing account
authRouter.post('/login', authenticateUser);

export default authRouter;
