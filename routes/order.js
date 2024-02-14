const router = require("express").Router();
const ordersController = require("../controllers/orderController");
const {verifyTokenAndAuthorization, verifyDriver, verifyVendor}= require("../middlewares/verifyToken")

router.get("/restaurant_orders/:id", ordersController.getRestaurantOrders)
router.get("/orderslist/:id", ordersController.getRestaurantOrdersList)
router.post("/",verifyTokenAndAuthorization, ordersController.placeOrder)
router.get("/:id", ordersController.getOrderDetails)
router.delete("/:id", ordersController.deleteOrder)
router.get("/",verifyTokenAndAuthorization,  ordersController.getUserOrders)
router.get("/delivery/:status", verifyDriver,  ordersController.getNearbyOrders)
router.post("/rate/:id", ordersController.rateOrder)
router.post("/status/:id", ordersController.updateOrderStatus)
router.post("/payment-status/:id", ordersController.updatePaymentStatus)
router.get("/picked/:status/:driver",verifyDriver, ordersController.getPickedOrders)
router.put("/picked-orders/:id/:driver", verifyDriver, ordersController.addDriver)
router.put("/delivered/:id", verifyDriver, ordersController.markAsDelivered)
router.put("/process/:id/:status", verifyVendor, ordersController.processOrder)

module.exports = router;