const router = require("express").Router();
const foodController = require("../controllers/foodController");


// UPADATE category
router.post("/", foodController.addFood);

router.post("/tags/:id", foodController.addFoodTag);

router.post("/type/:id", foodController.addFoodType);

router.get("/:id", foodController.getFoodById);

router.get("/:category/:code", foodController.getRandomFoodsByCategoryAndCode);

router.delete("/:id", foodController.deleteFoodById);

router.patch("/:id", foodController.foodAvailability);

router.get("/restaurant/:restaurantId", foodController.getFoodsByRestaurant);

router.get("/recommendation/:code", foodController.getRandomFoodsByCode);





module.exports = router