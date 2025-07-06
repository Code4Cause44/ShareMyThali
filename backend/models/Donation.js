const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodType: String,
    cuisine: String,
    quantity: Number,
    quantityAvailable: {
        type: Number,
        required: true,
        default: function() { return this.quantity; }
    },
    vegetarian: String,
    preparedAt: String,
    hygienic: Boolean,
    allergens: [String],
    pickupTime: String,
    agreement: Boolean,
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Picked Up', 'Delivered']
    },
    requestStatus: {
        type: String,
        default: 'Available',
        enum: ['Available', 'Pending Request', 'Fulfilled', 'Cancelled']
    }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);