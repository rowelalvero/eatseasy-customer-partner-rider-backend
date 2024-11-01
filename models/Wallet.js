const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    balance: { type: Number, default: 0.0 },
    transactions: [
        {
            amount: { type: Number, required: true },
            type: { type: String, required: true, enum: ['Top-up', 'Withdrawal'] },
            paymentMethod: { type: String, required: true },
            transactionDate: { type: Date, default: Date.now }
        }
    ]
});
module.exports = mongoose.model('Wallet', walletSchema);
