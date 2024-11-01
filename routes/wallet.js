// routes/walletRoutes.js
const express = require('express');
const walletController = require('../controllers/walletController');

const router = express.Router();
router.post('/wallet/create', walletController.createWallet);
router.get('/wallet/:driverId', walletController.getWallet);
router.post('/wallet/credit', walletController.creditWallet);
router.post('/wallet/debit', walletController.debitWallet);

module.exports = router;
