const Order = require("../models/Orders")

module.exports = {
    placeOrder: async (req, res) => {
        const order = new Order(req.body);
    
        try {
            await order.save();
            const orderId = order.id; 
            res.status(201).json({ status: true, message: 'Order placed successfully', orderId: orderId });
        } catch (error) {
            res.status(500).json({status: false,message: error.message});
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

    getUserOrders: async (req, res) => {
        const userId = req.user.id;
        const { paymentStatus, orderStatus } = req.query;
    
        let query = { userId };
    
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }
    
        if (orderStatus) {
            query.orderStatus = orderStatus;
        }
    
        // // Calculate the start of today
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);
    
        // // Calculate the start of yesterday
        // const yesterday = new Date(today);
        // yesterday.setDate(yesterday.getDate() - 1);
    
        // // Add date range to the query
        // query.orderDate = { $gte: yesterday, $lt: today };
    
        try {
            const orders = await Order.find(query)
                .populate({
                    path: 'orderItems.foodId',
                    select: 'imageUrl title rating time'
                })
                // .populate('driverId');
            
            res.status(200).json(orders);
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
        
    
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Completed' }, { new: true });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Payment status updated successfully', data: updatedOrder });
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getNearbyOrders: async (req, res) => {
        try {
            const parcels = await Order.find({orderStatus: req.params.status, paymentStatus: 'Completed'
            }).select('userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus')
                .populate({
                    path: 'userId',
                    select: 'phone profile' // Replace with actual field names for suid
                })
                .populate({
                    path: 'restaurantId',
                    select: 'title coords imageUrl logoUrl time' // Replace with actual field names for courier
                })
                .populate({
                    path: 'orderItems.foodId',
                    select: 'title imageUrl time' // Replace with actual field names for courier
                })
                .populate({
                    path: 'deliveryAddress',
                    select: 'addressLine1 city district' // Replace with actual field names for courier
                })



            res.status(200).json(parcels);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Error retrieving parcels', error: error.message });
        }
    },

    getPickedOrders: async (req, res) => {
        
        let status
        if(req.params.status === 'Out_for_Delivery'){
            status = "Out_for_Delivery"
        }else if(req.params.status === 'Delivered'){
            status = "Delivered"
        }else if(req.params.status === 'Manual'){
            status = "Manual"
        }else{
            status = "Cancelled"
        }
        try {
            const parcels = await Order.find({orderStatus: status, driverId: req.params.driver 
            }).select('userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords driverId orderStatus orderStatus orderStatus orderStatus orderStatus orderStatus orderStatus orderStatus')
                .populate({
                    path: 'userId',
                    select: 'phone profile' // Replace with actual field names for suid
                })
                .populate({
                    path: 'restaurantId',
                    select: 'title coords imageUrl' // Replace with actual field names for courier
                })
                .populate({
                    path: 'deliveryAddress',
                    select: 'addressLine1 city district' // Replace with actual field names for courier
                })

                console.log(parcels.length);
            res.status(200).json(parcels);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Error retrieving parcels', error: error.message });
        }
    },

    addDriver: async (req, res) => {
        const  orderId = req.params.id;
        const driver  = req.params.driver;
    
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: 'Out_for_Delivery', driverId: driver }, { new: true });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Order status updated successfully'});
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    markAsDelivered: async (req, res) => {
        const  orderId = req.params.id;

        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: 'Delivered' }, { new: true });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Order delivered successfully'});
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

}