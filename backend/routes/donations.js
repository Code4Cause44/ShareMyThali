const express = require('express');
const router = express.Router();
const {
    createDonation,
    getDonations,
    updateDonationStatus,
    getMyDonations 
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
router.post('/', protect, authorizeRoles('donor'), createDonation);
router.get('/', protect, authorizeRoles('donor', 'organization', 'admin'), getDonations);
router.get('/my-donations', protect, authorizeRoles('donor'), getMyDonations); 
router.patch('/:id/status', protect, authorizeRoles('donor', 'admin'), updateDonationStatus);

module.exports = router;