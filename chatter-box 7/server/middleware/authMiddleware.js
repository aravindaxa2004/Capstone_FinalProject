import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token in the Authorization header
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and attach user info to request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Token is invalid or expired
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateToken;
