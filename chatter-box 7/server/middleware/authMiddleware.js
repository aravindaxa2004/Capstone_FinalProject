/**
 * Authentication Middleware
 * Validates JWT tokens and protects private routes
 */
import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {
  // Extract authorization header
  const authorizationHeader = req.headers.authorization;
  
  // Verify Bearer token format
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token required.'
    });
  }
  
  // Extract token from header
  const accessToken = authorizationHeader.split(' ')[1];
  
  try {
    // Verify and decode token
    const decodedPayload = jwt.verify(accessToken, process.env.JWT_SECRET);
    
    // Attach user info to request object
    req.user = { id: decodedPayload.id };
    
    next();
  } catch (verificationError) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};

export default validateToken;
