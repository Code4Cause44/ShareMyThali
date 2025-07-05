const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  updateDonationStatus
} = require('../controllers/donationController');

const Donation = require('../models/Donation');
router.post('/', createDonation);

router.get('/', getDonations);

router.patch('/:id/status', updateDonationStatus);

module.exports = router;
