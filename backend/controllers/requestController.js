const Request = require('../models/Request');
const Donation = require('../models/Donation');
const User = require('../models/User'); 

exports.getAvailableDonations = async (req, res) => {
    try {
        const availableDonations = await Donation.find({
            requestStatus: 'Available',
            quantityAvailable: { $gt: 0 }
        })
        .populate('donor', 'username email phone address landmark')
        .sort({ createdAt: -1 });

        res.status(200).json(availableDonations);
    } catch (error) {
        console.error('Error fetching available donations:', error);
        res.status(500).json({ message: 'Server error fetching available donations', error });
    }
};

exports.createRequest = async (req, res) => {
    const organizationId = req.user.id; 
    const { donationId, quantityRequested } = req.body;

    try {
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        if (donation.requestStatus !== 'Available' || donation.quantityAvailable <= 0) {
            return res.status(400).json({ message: 'Donation is not available for request or has no quantity left.' });
        }
        if (quantityRequested <= 0 || quantityRequested > donation.quantityAvailable) {
            return res.status(400).json({ message: 'Invalid quantity requested. Must be positive and within available amount.' });
        }
        const existingRequest = await Request.findOne({
            donation: donationId,
            organization: organizationId,
            status: { $in: ['Pending', 'Accepted'] }
        });

        if (existingRequest) {
            return res.status(409).json({ message: 'You have an active request for this donation already.' });
        }

        const newRequest = new Request({
            donation: donationId,
            organization: organizationId,
            donor: donation.donor,
            quantityRequested
        });

        await newRequest.save();

        res.status(201).json(newRequest);

    } catch (error) {
        console.error('Error creating request:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already made an active request for this donation.' });
        }
        res.status(500).json({ message: 'Server error creating request.', error: error.message });
    }
};

exports.getRequestsByOrganization = async (req, res) => {
    const organizationId = req.user.id; 

    try {
        const requests = await Request.find({ organization: organizationId })
            .populate('donation', 'foodType cuisine quantity quantityAvailable address landmark pickupTime') 
            .populate('donor', 'username email phone') 
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching organization requests:', error);
        res.status(500).json({ message: 'Server error fetching your requests', error: error.message });
    }
};

exports.getRequestsForMyDonations = async (req, res) => {
    const donorId = req.user.id; 

    try {
        const requests = await Request.find({ donor: donorId })
            .populate('donation', 'foodType cuisine quantity quantityAvailable address landmark pickupTime') 
            .populate('organization', 'username email organizationName organizationAddress phone') 
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching requests for donor:', error);
        res.status(500).json({ message: 'Server error fetching requests for your donations', error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status, donorResponseMessage } = req.body;
    const userId = req.user.id; 
    const userRole = req.user.role; 

    try {
        const request = await Request.findById(id).populate('donation'); 

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const donation = request.donation;
        if (!donation) {
             return res.status(404).json({ message: 'Associated donation not found' });
        }
        if (donation.donor.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this request status. Only the donor of the food item can.' });
        }

        const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Fulfilled', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }
        if (status === 'Accepted' && request.status === 'Pending') {
            if (donation.quantityAvailable < request.quantityRequested) {
                return res.status(400).json({ message: 'Not enough quantity available to accept this request.' });
            }
            donation.quantityAvailable -= request.quantityRequested;
            request.acceptedAt = new Date();
            if (donation.quantityAvailable <= 0) {
                donation.requestStatus = 'Fulfilled';
            } else {
            }
            await donation.save(); 
        } else if (status === 'Fulfilled' && request.status === 'Accepted') {
            request.fulfilledAt = new Date(); 
        } else if (status === 'Cancelled' && request.status !== 'Fulfilled') {
            if (request.status === 'Accepted') {
                donation.quantityAvailable += request.quantityRequested;
                donation.requestStatus = 'Available';
                await donation.save();
            }
        } else if (status === 'Rejected' && request.status === 'Pending') {
        }
        else if (status !== 'Pending' && request.status !== 'Pending' && status !== 'Accepted' && request.status !== 'Accepted') {
            if (status !== request.status) {
                 return res.status(400).json({ message: `Cannot change request status from ${request.status} to ${status}` });
            }
        }


        request.status = status;
        request.donorResponseMessage = donorResponseMessage; 
        await request.save();

        res.status(200).json(request);

    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: 'Server error updating request status', error: error.message });
    }
};