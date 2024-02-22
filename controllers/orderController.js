const Order = require("../models/Orders")
const Driver = require("../models/Driver")
const admin = require("firebase-admin");
const { updateDriver, updateRestaurant, updateUser } = require("../utils/driver_update")
const sendNotification = require('../utils/sendNotification');
const Restaurant = require("../models/Restaurant");

module.exports = {
    placeOrder: async (req, res) => {

        const order = new Order(req.body);

        try {
            await order.save();
            const orderId = order.id;
            res.status(201).json({ status: true, message: 'Order placed successfully', orderId: orderId });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getOrderDetails: async (req, res) => {
        const orderId = req.params.id;

        try {
            const order = await Order.findById(orderId).select('userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus')
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
                    select: 'addressLine1' // Replace with actual field names for courier
                })
                .populate({
                    path: 'driverId',
                    select: 'phone vehicleNumber driver',// Replace with actual field names for courier
                    populate: {
                        path: 'driver',
                        select: 'phone username profile'
                    }
                });

            if (order.status === 'Out_for_Delivery' || order.status === 'Delivered') {
                const driver = await Driver.findById(order.driverId).select('phone vehicleNumber driver')
            }

            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
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
        const orderId = req.params.id;
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
        const orderId = req.params.id;
        const { orderStatus } = req.body;


        //firebase here we including {{orderid: id, status}}


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
        const orderId = req.params.id;


        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Completed' }, { new: true }).select('userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus')
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
                });
            if (updatedOrder) {
                res.status(200).json({ status: true, message: 'Payment status updated successfully', data: updatedOrder });
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getRestaurantOrders: async (req, res) => {

        let status
        if (req.query.status === 'placed') {
            status = "Placed"
        } else if (req.query.status === 'preparing') {
            status = "Preparing"
        } else if (req.query.status === 'ready') {
            status = "Ready"
        } else if (req.query.status === 'out_for_delivery') {
            status = "Out_for_Delivery"
        } else if (req.query.status === 'delivered') {
            status = "Delivered"
        } else if (req.query.status === 'manual') {
            status = "Manual"
        } else if (req.query.status === 'cancelled') {
            status = "Cancelled"
        }
        try {
            const parcels = await Order.find({
                orderStatus: status, restaurantId: req.params.id, paymentStatus: 'Completed'
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


            res.status(200).json(parcels);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Error retrieving parcels', error: error.message });
        }
    },

    getRestaurantOrdersList: async (req, res) => {
        let status
        if (req.query.status === 'placed') {
            status = "Placed"
        } else if (req.query.status === 'preparing') {
            status = "Preparing"
        } else if (req.query.status === 'ready') {
            status = "Ready"
        } else if (req.query.status === 'out_for_delivery') {
            status = "Out_for_Delivery"
        } else if (req.query.status === 'delivered') {
            status = "Delivered"
        } else if (req.query.status === 'manual') {
            status = "Manual"
        } else if (req.query.status === 'cancelled') {
            status = "Cancelled"
        }
        try {
            const parcels = await Order.find({
                orderStatus: status, restaurantId: req.params.id, paymentStatus: 'Completed'
            }).select('userId deliveryAddress orderItems deliveryFee restaurantId orderStatus restaurantCoords recipientCoords')
                .populate({
                    path: 'userId',
                    select: 'phone profile' // Replace with actual field names for suid
                }).populate({
                    path: 'restaurantId',
                    select: 'title imageUrl logoUrl time' // Replace with actual field names for courier
                })
                .populate({
                    path: 'orderItems.foodId',
                    select: 'title imageUrl time' // Replace with actual field names for courier
                }).populate({
                    path: 'deliveryAddress',
                    select: 'addressLine1' // Replace with actual field names for courier
                })


            res.status(200).json(parcels);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Error retrieving parcels', error: error.message });
        }
    },

    getNearbyOrders: async (req, res) => {
        try {
            const parcels = await Order.find({
                orderStatus: req.params.status, paymentStatus: 'Completed'
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
        if (req.params.status === 'Out_for_Delivery') {
            status = "Out_for_Delivery"
        } else if (req.params.status === 'Delivered') {
            status = "Delivered"
        } else if (req.params.status === 'Manual') {
            status = "Manual"
        } else {
            status = "Cancelled"
        }
        try {
            const parcels = await Order.find({
                orderStatus: status, driverId: req.params.driver
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
                    select: 'addressLine1' // Replace with actual field names for courier
                })

            res.status(200).json(parcels);
        } catch (error) {
            res.status(500).json({ status: false, message: 'Error retrieving parcels', error: error.message });
        }
    },

    addDriver: async (req, res) => {
        const orderId = req.params.id;
        const driver = req.params.driver;
        const status = 'Out_for_Delivery';

        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: 'Out_for_Delivery', driverId: driver }, { new: true }).select('userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus')
                .populate({
                    path: 'userId',
                    select: 'phone profile fcm' // Replace with actual field names for suid
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
                });

            if (updatedOrder) {
                const db = admin.database()
                updateRestaurant(updatedOrder, db, status);
                // send notification to the restaurant and to the client
                // sendNotification()
                updateUser(updatedOrder, db, status);
                res.status(200).json(updatedOrder);
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    markAsDelivered: async (req, res) => {
        const orderId = req.params.id;
        const status = 'Delivered';

        try {
            
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: 'Delivered' }, { new: true }).select('userId orderTotal deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus')
                .populate({
                    path: 'userId',
                    select: 'phone profile fcm' // Replace with actual field names for suid
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
                    select: 'addressLine1' // Replace with actual field names for courier
                });

                await Restaurant.findByIdAndUpdate(updatedOrder.restaurantId._id, {
                    $inc: { earnings: updatedOrder.orderTotal }
                  }, { new: true });
                  
            if (updatedOrder) {
                
                const db = admin.database()
                updateRestaurant(updatedOrder, db, status);
                updateUser(updatedOrder, db, status);
                // send notification to the restaurant and to the client
                // sendNotification()
                res.status(200).json(updatedOrder);
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    processOrder: async (req, res) => {
        const orderId = req.params.id;
        const status = req.params.status;

        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true }).select('userId deliveryAddress orderItems deliveryFee restaurantId restaurantCoords recipientCoords orderStatus')
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
                });
            if (updatedOrder) {
                const db = admin.database()
                if (status === 'Ready') {
                    updateDriver(updatedOrder, db)
                } else {
                    updateRestaurant(updatedOrder, db, status);
                    updateUser(updatedOrder, db, status);
                }


                res.status(200).json(updatedOrder);
            } else {
                res.status(404).json({ status: false, message: 'Order not found' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },



}