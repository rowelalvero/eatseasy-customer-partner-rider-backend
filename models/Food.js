const mongoose = require('mongoose');

const additiveSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
});

const customAdditiveSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    options: [{
        optionName: { type: String, required: true },
        price: { type: Number, required: true },
    }],
    linearScale: { type: Number },
    minScale: { type: Number },
    maxScale: { type: Number },
    minScaleLabel: { type: String },
    maxScaleLabel: { type: String },
    required: { type: Boolean, default: false },
    selectionType: { type: String },
    selectionNumber: { type: Number },
    customErrorMessage: { type: String },
});

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    foodTags: [{ type: String, required: true }],
    category: { type: String, required: true },
    foodType: [{ type: String, required: true }],
    code: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
    },
    ratingCount: { type: Number, default: 302 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: [additiveSchema],
    additiveQuestions: [customAdditiveSchema],
    imageUrl: [{ type: String, required: true }],
});

module.exports = mongoose.model('Food', foodSchema);
