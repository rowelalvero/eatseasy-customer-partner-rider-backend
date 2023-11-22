const Address = require('../models/Address')
const User = require('../models/User')

module.exports = {
    createAddress: async (req, res) => {
       
        const address = new Address({
            userId: req.user.id,
            district: req.body.district,
            addressLine1: req.body.addressLine1,
            city: req.body.city,
            state: req.body.state, 
            postalCode: req.body.postalCode,
            default: req.body.default,
            country: req.body.country,
            deliveryInstructions: req.body.deliveryInstructions
        });
    
        try {
            if (req.body.default) {
                // Ensure no other address is set as default for this user
                await Address.updateMany({ userId: req.body.userId }, { default: false });
            }
            await address.save();
            res.status(201).json({ status: true, message: 'Address successfully added', data: address });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    setDefaultAddress: async (req, res) => {
        const userId = req.body.userId;
        const addressId = req.body.addressId;
    
        try {
            // Set all addresses for this user to non-default
            await Address.updateMany({ userId }, { default: false });
    
            // Now set the specified address as default
            const updatedAddress = await Address.findByIdAndUpdate(addressId, { default: true }, { new: true });
    
            if (updatedAddress) {
                // Update the user's address field to the new default address
                await User.findByIdAndUpdate(userId, { address: addressId }, { new: true });
    
                res.status(200).json({ status: true, message: 'Address set as default successfully', data: updatedAddress });
            } else {
                res.status(404).json({ status: false, message: 'Address not found' });
            }
        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },
    

    deleteAddress: async (req, res) => {
        const  addressId  = req.params.id;
    
        try {
            await Address.findByIdAndDelete(addressId);
            res.status(200).json({ status: true, message: 'Address deleted successfully' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getDefaultAddress: async (req, res) => {
        const userId  = req.user.id;
    
        try {
            const defaultAddress = await Address.findOne({ userId, default: true });
            res.status(200).json(defaultAddress);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUserAddresses: async (req, res) => {
        const  userId  = req.params.id;

    
        try {
            const addresses = await Address.find({ userId });
            res.status(200).json({ status: true, data: addresses });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updateAddress: async (req, res) => {
        const  addressId  = req.params.id;

    
        try {
            if (req.body.default) {
                // Ensure no other address is set as default for this user
                await Address.updateMany({ userId: req.body.userId }, { default: false });
            }
            const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
            res.status(200).json({ status: true, message: 'Address updated successfully', data: updatedAddress });
        } catch (error) {
            res.status(500).json(error);
        }
    },

  
    
    
}