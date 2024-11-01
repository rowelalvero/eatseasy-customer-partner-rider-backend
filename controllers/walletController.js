// controllers/walletController.js
const Wallet = require('../models/Wallet');
const Driver = require('../models/Driver');

// Create a wallet for a driver
exports.createWallet = async (req, res) => {
    const { driverId } = req.body;
    try {
        // Check if wallet already exists for this driver
        let wallet = await Wallet.findOne({ driver: driverId });
        if (wallet) {
            return res.status(400).json({ message: "Wallet already exists for this driver" });
        }

        // Initialize a new wallet with a zero balance
        wallet = new Wallet({ driver: driverId, balance: 0 });
        await wallet.save();
        res.status(201).json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get wallet balance and transactions for a driver
exports.getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ driver: req.params.driverId }).populate('driver');
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a credit transaction
exports.creditWallet = async (req, res) => {
    const { driverId, amount, description } = req.body;
    try {
        let wallet = await Wallet.findOne({ driver: driverId });
        if (!wallet) {
            wallet = new Wallet({ driver: driverId, balance: 0 });
        }
        wallet.balance += amount;
        wallet.transactions.push({ amount, type: 'credit', description });
        await wallet.save();
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a debit transaction
exports.debitWallet = async (req, res) => {
    const { driverId, amount, description } = req.body;
    try {
        let wallet = await Wallet.findOne({ driver: driverId });
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        wallet.balance -= amount;
        wallet.transactions.push({ amount, type: 'debit', description });
        await wallet.save();
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
