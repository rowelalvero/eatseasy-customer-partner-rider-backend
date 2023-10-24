const Order = require("../models/Orders")

module.exports = {
    placeOrder: async (req, res) => {
        const order = new Order(req.body);
    
        try {
            await order.save();
            res.status(201).json({ status: true, message: 'Order placed successfully', data: order });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getOrderDetails: async (req, res) => {
        const orderId  = req.params.id;
    
        try {
            const order = await Order.findById(orderId)
                .populate({
                    path: 'userId',
                    select: 'name email'  // Fetch only the name and email of the user
                })
                .populate({
                    path: 'deliveryAddress',
                    select: 'addressLine1 city state postalCode'  // Fetch specific address fields
                })
                .populate({
                    path: 'restaurantId',
                    select: 'name location'  // Fetch the name and location of the restaurant
                })
                .populate({
                    path: 'driverId',
                    select: 'name phone'  // Fetch only the name and phone of the driver
                });
    
            if (order) {
                res.status(200).json({ status: true, data: order });
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteOrder: async (req, res) => {
        const { orderId } = req.params;
    
        try {
            await Order.findByIdAndDelete(orderId);
            res.status(200).json({ status: true, message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUserOrders: async (req, res) => {
        const userId = req.user.id;
    
        try {
            const orders = await Order.find({ userId }).populate('restaurantId').populate('driverId');
            res.status(200).json({ status: true, data: orders });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    rateOrder: async (req, res) => {
        const orderId  = req.params.id;
        const { rating, feedback } = req.body;
    
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { rating, feedback }, { new: true });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Rating and feedback added successfully', data: updatedOrder });
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updateOrderStatus: async (req, res) => {
        const  orderId = req.params.id;
        const {orderStatus}  = req.body;
    
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Order status updated successfully', data: updatedOrder });
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updatePaymentStatus: async (req, res) => {
        const orderId  = req.params.id;
        const { paymentStatus } = req.body;
    
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Payment status updated successfully', data: updatedOrder });
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
    
    
}