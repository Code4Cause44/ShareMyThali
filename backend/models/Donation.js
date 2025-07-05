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
  preparedAt: Date,
  hygienic: Boolean,
  allergens: [String],
  pickupTime: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);
