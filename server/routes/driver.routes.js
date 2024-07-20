const express = require('express');
const { registerDriver, loginDriver, forgotPassword, resetPassword, logoutDriver, updateDriver, getDriverById, updateDriverLocation } = require('../controllers/driver.controller');
const driverAuth = require('../middlewares/driver.middleware');



const router = express.Router();

// Public routes
router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);
router.get('/:id', getDriverById);
router.patch('/:id/location', updateDriverLocation);

// Protected routes
router.post('/logout', driverAuth, logoutDriver);
router.patch('/update', driverAuth, updateDriver); 

module.exports = router;
