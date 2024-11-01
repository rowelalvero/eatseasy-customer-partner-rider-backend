const router = require("express").Router();
const walletController = require("../controllers/walletController");
const { verifyTokenAndAuthorization } = require("../middlewares/verifyToken");

router.get("/", verifyTokenAndAuthorization, walletController.getWalletDetails);
router.post("/topup", verifyTokenAndAuthorization, walletController.topUpWallet);
router.post("/withdraw", verifyTokenAndAuthorization, walletController.withdrawFromWallet);

module.exports = router;
