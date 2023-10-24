const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicleType: { type: String, required: true, enum: ['Bike', 'Car', 'Scooter'] },
    vehicleNumber: { type: String, required: true },
    currentLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitudeDelta:{type: Number , default: 0.0122},
        longitudeDelta: {type: Number , default: 0.0221},
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, min: 1, max: 5 },
    totalDeliveries: { type: Number, default: 0 },
    profileImage: String,
    isActive: { type: Boolean, default: true } // To track if the driver is currently active on the platform
});

module.exports = mongoose.model('Driver', driverSchema);
