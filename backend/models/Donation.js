const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  landmark: String,
  foodType: String,
  cuisine: String,
  quantity: Number,
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
