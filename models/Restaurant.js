const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    title: {type: String , required: true},
    time: {type: String , required: true},
    imageUrl: {type: String , required: true},
    foods: {type: Array , required: true},
    pickup: {type: Boolean , required: true, default: true},
    delivery: {type: Boolean , required: true, default: true},
    owner: {type: String , required: true},
    isAvailable: {type: Boolean , required: true, default: true},
    code: {type: String , required: true},
    logoUrl: {type: String , required: true},
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingCount: {type: String },
    coords: {
        id: {type: String },
        latitude: {type: Number , required: true},
        longitude: {type: Number , required: true},
        latitudeDelta:{type: Number , default: 0.0122},
        longitudeDelta: {type: Number , default: 0.0221},
        address: {type: String , required: true},
        title: {type: String , required: true},
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
