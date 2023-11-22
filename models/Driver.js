const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicleType: { type: String, required: true, enum: ['Bike', 'Car', 'Scooter', 'Drone'] },
    phone: { type: String, required: true},
    vehicleNumber: { type: String, required: true },
    currentLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, min: 1, max: 5, default: 3},
    totalDeliveries: { type: Number, default: 0 },
    profileImage: {type:String, default: "https://d326fntlu7tb1e.cloudfront.net/uploads/cf503f8d-3318-4306-9e2c-a53efb7d585b-avatar.png"},
    isActive: { type: Boolean, default: true } // To track if the driver is currently active on the platform
});

module.exports = mongoose.model('Driver', driverSchema);
