const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    default: { type: Boolean, default: false },
    country: { type: String, required: true },
    deliveryInstructions: String
});

module.exports = mongoose.model('Address', addressSchema);
