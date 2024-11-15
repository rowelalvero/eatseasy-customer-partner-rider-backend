const router = require("express").Router();
const userController = require("../controllers/userController");
const {verifyTokenAndAuthorization, verifyAdmin}= require("../middlewares/verifyToken")


// UPADATE USER
router.put("/:userId", verifyTokenAndAuthorization, userController.updateUser);
router.put("/:email", verifyTokenAndAuthorization, userController.changePassword);

router.get("/verify/:otp",verifyTokenAndAuthorization, userController.verifyAccount);
router.get("/customer_service", userController.getAdminNumber);

router.post("/feedback",verifyTokenAndAuthorization, userController.userFeedback);
router.get("/verify_phone/:phone",verifyTokenAndAuthorization, userController.verifyPhone);
router.delete("/" , verifyTokenAndAuthorization, userController.deleteUser);
router.get("/",verifyTokenAndAuthorization, userController.getUser);
router.put("/updateToken/:token",verifyTokenAndAuthorization, userController.updateFcm);
router.get("/byId/:id", userController.getUserById);

module.exports = router