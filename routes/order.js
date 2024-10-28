const router = require("express").Router();
const ordersController = require("../controllers/orderController");
const {verifyTokenAndAuthorization, verifyDriver, verifyVendor}= require("../middlewares/verifyToken")

router.get("/restaurant_orders/:id", ordersController.getRestaurantOrders)
router.get("/orderslist/:id", ordersController.getRestaurantOrdersList)
router.post("/",verifyTokenAndAuthorization, ordersController.placeOrder)
router.get("/:id", ordersController.getOrderDetails)
router.get('/:orderId/status', ordersController.getOrderDetails)
router.delete("/:id", ordersController.deleteOrder)
router.get("/",verifyTokenAndAuthorization, ordersController.getUserOrders)
router.get("/delivery/:status", ordersController.getNearbyOrders)
router.post("/rate/:id", ordersController.rateOrder)
router.post("/status/:id", ordersController.updateOrderStatus)
router.post("/payment-status/:id", ordersController.updatePaymentStatus)
router.get("/picked/:status/:driver",verifyDriver, ordersController.getPickedOrders)
router.put("/picked-orders/:id", verifyDriver, ordersController.orderPicked)
router.put("/accepted/:id/:driverId", verifyDriver, ordersController.orderAccepted)
router.put("/delivered/:id", verifyDriver, ordersController.orderDelivered)
router.get("/delivered/delivered", verifyDriver, ordersController.getDeliveredOrders)
router.put("/process/:id/:status", verifyVendor, ordersController.processOrder)

module.exports = router;