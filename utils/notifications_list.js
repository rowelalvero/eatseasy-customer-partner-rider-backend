const sendPushNotification = require("./sendNotification");


 function sendDeliveredOrder(token, orderId) {
    if (token || token !== null) {
        sendPushNotification(token, `Your order has been delivered`, {
            orderId: orderId.toString()
        }, "Order Delivered",)
    }
}

 function sendDeliveredOrderToRestaurant(token, orderId) {
    if (token && token !== null) {
        sendPushNotification(token, `Order ${orderId} has been delivered`, {
            orderId: orderId.toString()
        }, "Order Delivered")
    }
}

 function sendOrderPickedUp(token, orderId) {
    if (token && token !== null) {
        sendPushNotification(token, `Your order has been picked up and is on its way`, {
            orderId: orderId.toString()
        }, "Order Picked Up")
    }
}

 function sendOrderPreparing(token, orderId) {
    if (token && token !== null) {
        sendPushNotification(token, `Your order is being prepared and will be ready soon`, {
            orderId: orderId.toString()
        }, "Order Preparing")
    }
}

 function sendOrderCancelled(token, orderId) {
    if (token && token !== null) {
        sendPushNotification(token, `Your order has been cancelled. COntact the restuarant for more information`, {
            orderId: orderId.toString()
        }, "Order Cancelled")
    }
}

 function sendOrderWaitingForCourier(token, orderId) {
    if (token && token !== null) {
        sendPushNotification(token, `Your order is waiting to be picked up by a courier`, {
            orderId: orderId.toString()
        }, "Order Waiting for Courier")
    }
}

exports = {sendDeliveredOrder, sendDeliveredOrderToRestaurant, sendOrderPickedUp, sendOrderPreparing, sendOrderCancelled, sendOrderWaitingForCourier}