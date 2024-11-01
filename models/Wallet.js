// models/wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    balance: { type: Number, default: 0.0 },
    transactions: [
        {
            amount: { type: Number, required: true },
            type: { type: String, enum: ['credit', 'debit'], required: true },
            date: { type: Date, default: Date.now },
            description: { type: String }
        }
    ]
});

module.exports = mongoose.model('Wallet', walletSchema);
