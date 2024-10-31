const mongoose = require('mongoose');

const additiveSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true }
});

const optionsSchema = new mongoose.Schema({
    optionName: { type: String, required: true },
    price: { type: String, required: true }
});

const customAdditivesSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    type: { type: String, required: false },
    options: { type: [optionsSchema], required: false }, // Array of options
    linearScale: { type: Number, required: false },
    minScale: { type: Number, required: false },
    maxScale: { type: Number, required: false },
    minScaleLabel: { type: String, required: false },
    maxScaleLabel: { type: String, required: false },
    required: { type: Boolean, default: false },
    selectionType: { type: String, required: false },
    selectionNumber: { type: Number, required: false },
    customErrorMessage: { type: String, required: false }
});

const foodSchema = new mongoose.Schema({
    title: { type: String, required: true },
    foodTags: { type: [String], required: true }, // Array of strings
    foodType: { type: [String], required: true }, // Array of strings
    code: { type: String, required: false },
    isAvailable: { type: Boolean, required: false, default: true },
    restaurant: { type: String, required: false },
    rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 3,
        },
        ratingCount: {type: String, default: "302"},
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: { type: [additiveSchema], required: true }, // Array of Additive subdocuments
    imageUrl: { type: [String], required: true }, // Array of strings
    v: { type: Number, required: false },
    category: { type: String, required: false },
    time: { type: String, required: false },
    customAdditives: { type: [customAdditivesSchema], required: true } // Array of CustomAdditives subdocuments
});

// Create a Food model
const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
