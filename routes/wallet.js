// routes/walletRoutes.js
const express = require('express');
const walletController = require('../controllers/walletController');

const router = express.Router();
router.post('/', walletController.createWallet);
router.get('/:driverId', walletController.getWallet);
router.post('/credit', walletController.creditWallet);
router.post('/debit', walletController.debitWallet);

module.exports = router;
