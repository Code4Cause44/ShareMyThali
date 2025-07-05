const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/available-donations', requestController.getAvailableDonations);

router.post('/', requestController.createRequest);

router.get('/my-requests', requestController.getRequestsByOrganization);

router.put('/:id/status', requestController.updateRequestStatus);

module.exports = router;