const Food = require("../models/Food")


module.exports = {
    addFood: async (req, res) => {
        const newFood = new Food(req.body);

        try {
            await newFood.save();
            res.status(201).json({ status: true, message: 'Food item successfully created' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getFoodById: async (req, res) => {
        const foodId = req.params.id;

        try {
            const food = await Food.findById(foodId) // populate the restaurant field if needed

            if (!food) {
                return res.status(404).json({ status: false, message: 'Food item not found' });
            }

            res.status(200).json(food);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getFoodsByRestaurant: async (req, res) => {
        const restaurantId = req.params.restaurantId;

        try {
            const foods = await Food.find({ restaurant: restaurantId });

            if (!foods || foods.length === 0) {
                return res.status(404).json({ status: false, message: 'No food items found for this restaurant' });
            }

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteFoodById: async (req, res) => {
        const foodId = req.params.id;

        try {
            const food = await Food.findByIdAndDelete(foodId);

            if (!food) {
                return res.status(404).json({ status: false, message: 'Food item not found' });
            }

            res.status(200).json({ status: true, message: 'Food item successfully deleted' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    foodAvailability: async (req, res) => {
        const foodId = req.params.id;

        try {
            // Find the restaurant by its ID
            const food = await Food.findById(foodId);

            if (!restaurant) {
                return res.status(404).json({ message: 'Food not found' });
            }

            // Toggle the isAvailable field
            food.isAvailable = !food.isAvailable;

            // Save the changes
            await food.save();

            res.status(200).json({ message: 'Availability toggled successfully' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    updateFoodById: async (req, res) => {
        const foodId = req.params.id;

        try {
            const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, { new: true, runValidators: true });

            if (!updatedFood) {
                return res.status(404).json({ status: false, message: 'Food item not found' });
            }

            res.status(200).json({ status: true, message: 'Food item successfully updated' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    addFoodTag: async (req, res) => {
        const foodId = req.params.id;
        const { tag } = req.body;  // Assuming the tag to be added is sent in the request body

        if (!tag) {
            return res.status(400).json({ status: false, message: 'Tag is required' });
        }

        try {
            const food = await Food.findById(foodId);

            if (!food) {
                return res.status(404).json({ status: false, message: 'Food item not found' });
            }

            // Check if tag already exists
            if (food.foodTags.includes(tag)) {
                return res.status(400).json({ status: false, message: 'Tag already exists' });
            }

            food.foodTags.push(tag);
            await food.save();

            res.status(200).json({ status: true, message: 'Tag successfully added', data: food });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getRandomFoodsByCode: async (req, res) => {
        try {

            // If code is provided in the params, try to fetch matching food items

           const randomFoodItems = await Food.aggregate([
                { $match: { code: req.params.code } },
                { $sample: { size: 5 } },
                { $project: { _id: 0 } }
            ]);

            res.status(200).json(randomFoodItems);

        } catch (error) {
            res.status(500).json(error);
        }
    },

    addFoodType: async (req, res) => {
        const foodId = req.params.id;
        const { foodType } = req.body.foodType;  // Assuming the tag to be added is sent in the request body


        try {
            const food = await Food.findById(foodId);

            if (!food) {
                return res.status(404).json({ status: false, message: 'Food item not found' });
            }

            // Check if tag already exists
            if (food.foodType.includes(foodType)) {
                return res.status(400).json({ status: false, message: 'Type already exists' });
            }

            food.foodType.push(foodType);
            await food.save();

            res.status(200).json({ status: true, message: 'Type successfully added' });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getRandomFoodsByCategoryAndCode: async (req, res) => {
        const { category, code } = req.params;  // Assuming category, code, and value are sent as parameters

        try {
            let foods = await Food.aggregate([
                { $match: { category: category, code: code } },
                { $sample: { size: 10 } }
            ]);

            if (!foods || foods.length === 0) {
                foods = await Food.aggregate([
                    { $match: { code: code } },
                    { $sample: { size: 10 } }
                ]);
            } else {
                foods = await Food.aggregate([
                    { $sample: { size: 10 } }
                ]);
            }

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json(error);
        }
    }

}