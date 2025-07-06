const Donation = require('../models/Donation');
const User = require('../models/User'); 

exports.createDonation = async (req, res) => {
    const donorId = req.user.id;
    const {
        foodType,
        cuisine,
        quantity,
        vegetarian,
        preparedAt,
        hygienic,
        allergens,
        pickupTime,
        agreement
    } = req.body;

    try {
        const donorUser = await User.findById(donorId);
        if (!donorUser) {
            return res.status(404).json({ message: 'Donor user not found.' });
        }

        const donation = new Donation({
            donor: donorId,
            foodType,
            cuisine,
            quantity,
            quantityAvailable: quantity, 
            vegetarian,
            preparedAt,
            hygienic,
            allergens,
            pickupTime,
            agreement,
            status: 'Pending',
            requestStatus: 'Available' 
        });

        await donation.save();
        res.status(201).json(donation);
    } catch (error) {
        console.error('Error creating donation:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error creating donation.' });
    }
};

exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate('donor', 'username email role organizationName organizationAddress') // Populate donor info, exclude password
            .sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ message: 'Server error fetching donations.' });
    }
};
exports.updateDonationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        let donation = await Donation.findById(id);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.donor.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this donation status' });
        }

        const validStatuses = ['Pending', 'Picked Up', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid donation status provided' });
        }

        donation.status = status;
        await donation.save();

        res.status(200).json(donation);
    } catch (error) {
        console.error('Error updating donation status:', error);
        res.status(500).json({ message: 'Server error updating donation status', error: error.message });
    }
};
exports.getMyDonations = async (req, res) => {
    const donorId = req.user.id; 

    try {
        const donations = await Donation.find({ donor: donorId })
            .sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching my donations:', error);
        res.status(500).json({ message: 'Server error fetching your donations.' });
    }
};