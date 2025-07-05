const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation', 
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterEmail: {
        type: String,
        required: true
    },
    requesterPhone: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    organizationAddress: {
        type: String,
        required: true
    },
    quantityRequested: {
        type: Number,
        required: true,
        min: 1 
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Fulfilled', 'Cancelled'],
        default: 'Pending'
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    donorResponseMessage: {
        type: String
    },
    acceptedAt: {
        type: Date
    },
    fulfilledAt: {
        type: Date
    }
}, {
    timestamps: true 
});

requestSchema.index({ donation: 1, requesterEmail: 1 }, { unique: true, sparse: true });


module.exports = mongoose.model('Request', requestSchema);