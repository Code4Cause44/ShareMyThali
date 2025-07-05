const Request = require('../models/Request');
const Donation = require('../models/Donation');

exports.getAvailableDonations = async (req, res) => {
    try {
        const availableDonations = await Donation.find({
            requestStatus: 'Available',
            quantityAvailable: { $gt: 0 }
        }).sort({ createdAt: -1 }); 

        res.status(200).json(availableDonations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available donations', error });
    }
};
exports.createRequest = async (req, res) => {
    const {
        donationId,
        requesterName,
        requesterEmail,
        requesterPhone,
        organizationName,
        organizationAddress,
        quantityRequested
    } = req.body;

    try {
        const donation = await Donation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.requestStatus !== 'Available' || donation.quantityAvailable <= 0) {
            return res.status(400).json({ message: 'Donation is not available for request' });
        }

        if (quantityRequested <= 0 || quantityRequested > donation.quantityAvailable) {
            return res.status(400).json({ message: 'Invalid quantity requested' });
        }
        const existingRequest = await Request.findOne({
            donation: donationId,
            requesterEmail: requesterEmail,
            status: { $in: ['Pending', 'Accepted'] }
        });

        if (existingRequest) {
            return res.status(409).json({ message: 'You have already made an active request for this donation.' });
        }
        const newRequest = new Request({
            donation: donationId,
            requesterName,
            requesterEmail,
            requesterPhone,
            organizationName,
            organizationAddress,
            quantityRequested
        });

        await newRequest.save();

        res.status(201).json(newRequest);

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A request for this donation from your organization already exists.' });
        }
        res.status(500).json({ message: 'Error creating request', error });
    }
};
exports.getRequestsByOrganization = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email parameter is required.' });
    }

    try {
        const requests = await Request.find({ requesterEmail: email })
            .populate('donation', 'foodType quantity quantityAvailable')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organization requests', error });
    }
};
exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status, donorResponseMessage } = req.body;

    try {
        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        const validStatuses = ['Accepted', 'Rejected', 'Fulfilled', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        if (status === 'Accepted' && request.status !== 'Accepted') { 
            const donation = await Donation.findById(request.donation);

            if (!donation) {
                return res.status(404).json({ message: 'Associated donation not found' });
            }

            if (donation.quantityAvailable < request.quantityRequested) {
                return res.status(400).json({ message: 'Not enough quantity available for this request.' });
            }
            donation.quantityAvailable -= request.quantityRequested;
            if (donation.quantityAvailable === 0) {
                donation.requestStatus = 'Fulfilled'; 
            } else {
            }
            await donation.save();
            request.acceptedAt = new Date(); 
        }

        if (status === 'Fulfilled' && request.status === 'Accepted') {
            request.fulfilledAt = new Date();
        }

        if (status === 'Cancelled' || status === 'Rejected') {
        }

        request.status = status;
        request.donorResponseMessage = donorResponseMessage;
        await request.save();

        res.status(200).json(request);

    } catch (error) {
        res.status(500).json({ message: 'Error updating request status', error });
    }
};