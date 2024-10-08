const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    additives: {type: [] },
    instructions: {type: String, default: ''},
    totalPrice: {type: Number , required: true},
    quantity: {type: Number , required: true},
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
});

module.exports = mongoose.model('Cart', cartSchema);

