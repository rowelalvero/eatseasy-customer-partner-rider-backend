const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    foodTags: [{ type: String, required: true }], // Specify the type of items in the array
    category: { type: String, required: true },
    foodType: [{ type: String, required: true }], // Specify the type of items in the array
    code: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
    },
    ratingCount: { type: Number, default: 302 }, // Change to Number
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: [{ type: String, required: true }], // Specify the type of items in the array
    imageUrl: [{ type: String, required: true }], // Specify the type of items in the array
});

module.exports = mongoose.model('Food', foodSchema);
