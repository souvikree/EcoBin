const express = require('express');
const { getBinStatus } = require('../controllers/bin.controller');


const router = express.Router();

// Route to get bin status
router.get('/:id/status', getBinStatus);

module.exports = router;
