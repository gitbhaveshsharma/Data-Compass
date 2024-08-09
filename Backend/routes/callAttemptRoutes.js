const express = require('express');
const router = express.Router();
const callAttemptController = require('../controllers/callAttemptController');

// Get all call attempts
router.get('/', callAttemptController.getCallAttempts);

// Get a specific call attempt by ID
router.get('/:id', callAttemptController.getCallAttemptById);

// Create a new call attempt
router.post('/', callAttemptController.createCallAttempt);

// Update a call attempt
router.put('/:id', callAttemptController.updateCallAttempt);

// Delete a call attempt
router.delete('/:id', callAttemptController.deleteCallAttempt);

// Get call attempts by dataId
router.get('/data/:dataId', callAttemptController.getCallAttemptsByDataId);
module.exports = router;
