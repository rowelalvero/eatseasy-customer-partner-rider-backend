const router = require("express").Router();
const ordersController = require("../controllers/orderController");
const {verifyTokenAndAuthorization, verifyDriver}= require("../middlewares/verifyToken")

router.post("/",verifyTokenAndAuthorization, ordersController.placeOrder)
router.get("/:id", ordersController.getOrderDetails)
router.delete("/:id", ordersController.deleteOrder)
router.get("/user-orders",verifyTokenAndAuthorization,  ordersController.getUserOrders)
router.get("/delivery/:status", verifyDriver,  ordersController.getNearbyOrders)
router.post("/rate/:id", ordersController.rateOrder)
router.post("/status/:id", ordersController.updateOrderStatus)
router.post("/payment-status/:id", ordersController.updatePaymentStatus)
router.get("/picked/:status/:driver",verifyDriver, ordersController.getPickedOrders)
router.put("/picked-orders/:id/:driver", verifyDriver, ordersController.addDriver)
router.put("/delivered/:id", verifyDriver, ordersController.markAsDelivered)

module.exports = router;