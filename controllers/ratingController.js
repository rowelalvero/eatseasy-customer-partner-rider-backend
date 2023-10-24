const Rating = require('../models/Rating')

module.exports = {
    addOrUpdateRating: async (req, res) => {
        const { userId, product, rating } = req.body;
    
        try {
            let userRating = await Rating.findOne({ userId, product });
    
            if (userRating) {
                // Update existing rating
                userRating.rating = rating;
                await userRating.save();
                res.status(200).json({ status: true, message: 'Rating updated successfully', data: userRating });
            } else {
                // Add new rating
                const newRating = new Rating({ userId, product, rating });
                await newRating.save();
                res.status(201).json({ status: true, message: 'Rating added successfully', data: newRating });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    
}