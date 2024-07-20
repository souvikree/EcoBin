const jwt = require('jsonwebtoken');
const Driver = require('../models/driver.model'); // Adjust path as necessary

const driverAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }
    console.log('Token from header:', token); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); 

    const driver = await Driver.findOne({ _id: decoded._id, 'tokens.token': token });
    console.log('Driver found:', driver); 

    if (!driver) {
      throw new Error('Driver not found');
    }

    req.token = token;
    req.driver = driver;
    next();
  } catch (error) {
    console.error('Auth error:', error.message); 
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = driverAuth;
