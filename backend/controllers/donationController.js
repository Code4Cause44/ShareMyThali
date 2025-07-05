const Donation = require('../models/Donation');

exports.updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};


exports.createDonation = async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
