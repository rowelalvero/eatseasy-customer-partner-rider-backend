const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    foodTags: {type: Array, required: true},
    category: {type: String, required: true},
    foodType: {type: Array, required: true},
    code: {type: String, required: true},
    isAvailable: {type: Boolean , required: true, default: true},
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    ratingCount: {type: String, default: "0"},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: { type: Array, required: true },
    imageUrl: { type: Array, required: true },
});

module.exports = mongoose.model('Food', foodSchema);


