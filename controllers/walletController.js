const Wallet = require('../models/Wallet');
const Driver = require('../models/Driver');

module.exports = {
    getWalletDetails: async (req, res) => {
        const driverId = req.user.id;
        try {
            const wallet = await Wallet.findOne({ driver: driverId });
            if (!wallet) return res.status(404).json({ status: false, message: 'Wallet not found' });
            res.status(200).json({ status: true, balance: wallet.balance, transactions: wallet.transactions });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    topUpWallet: async (req, res) => {
        const driverId = req.user.id;
        const { amount, paymentMethod } = req.body;
        try {
            let wallet = await Wallet.findOne({ driver: driverId });
            if (!wallet) {
                wallet = new Wallet({ driver: driverId });
            }
            const newTransaction = {
                amount: amount,
                type: 'Top-up',
                paymentMethod: paymentMethod,
            };
            wallet.transactions.push(newTransaction);
            wallet.balance += amount;
            await wallet.save();
            res.status(200).json({ status: true, message: 'Wallet top-up successful', balance: wallet.balance });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    withdrawFromWallet: async (req, res) => {
        const driverId = req.user.id;
        const { amount, paymentMethod } = req.body;
        try {
            const wallet = await Wallet.findOne({ driver: driverId });
            if (!wallet || wallet.balance < amount) {
                return res.status(400).json({ status: false, message: 'Insufficient balance' });
            }
            const newTransaction = {
                amount: amount,
                type: 'Withdrawal',
                paymentMethod: paymentMethod,
            };
            wallet.transactions.push(newTransaction);
            wallet.balance -= amount;
            await wallet.save();
            res.status(200).json({ status: true, message: 'Withdrawal successful', balance: wallet.balance });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};
