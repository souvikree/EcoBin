const express = require('express');
const { getBinStatus, getAllBins, getBinById, notifyDrivers, acceptTask } = require('../controllers/bin.controller');
const driverAuth = require('../middlewares/driver.middleware');


const router = express.Router();

// Route to get bin status
router.get('/:id/status', getBinStatus);
router.get('/', getAllBins);
router.get('/:id', getBinById);
router.post('/:id/notify', notifyDrivers);
router.post('/:id/accept', driverAuth, acceptTask);

module.exports = router;
