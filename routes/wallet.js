// routes/walletRoutes.js
const router = require("express").Router();
const walletController = require('../controllers/walletController');
const {verifyTokenAndAuthorization, verifyDriver}= require("../middlewares/verifyToken")

const router = express.Router();
router.post('/', walletController.createWallet);
router.get('/:driverId', walletController.getWallet);
router.post('/credit', walletController.creditWallet);
router.post('/debit', walletController.debitWallet);

module.exports = router;
