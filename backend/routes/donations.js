const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations
} = require('../controllers/donationController');

const Donation = require('../models/Donation');
router.post('/', createDonation);

router.get('/', getDonations);

module.exports = router;
