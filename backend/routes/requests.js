const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const { authorizeRoles } = require('../middleware/roleMiddleware'); 
const requestController = require('../controllers/requestController');

router.get('/available-donations', protect, authorizeRoles('donor', 'organization', 'admin'), requestController.getAvailableDonations);
router.post('/', protect, authorizeRoles('organization'), requestController.createRequest);
router.get('/my-requests', protect, authorizeRoles('organization'), requestController.getRequestsByOrganization);
router.get('/donated-food-requests', protect, authorizeRoles('donor'), requestController.getRequestsForMyDonations); 
router.put('/:id/status', protect, authorizeRoles('donor', 'admin'), requestController.updateRequestStatus);

module.exports = router;