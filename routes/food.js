const router = require("express").Router();
const foodController = require("../controllers/foodController");


// UPADATE category
router.get('/restaurant-foods/:id', foodController.getFoodList)

router.post("/", foodController.addFood);

router.post("/tags/:id", foodController.addFoodTag);

router.post("/type/:id", foodController.addFoodType);

router.get("/:id", foodController.getFoodById);
router.get("/search/:food", foodController.searchFoods);

router.get("/:category/:code", foodController.getRandomFoodsByCategoryAndCode);

router.delete("/:id", foodController.deleteFoodById);

router.patch("/:id", foodController.foodAvailability);


router.get("/recommendation/:code", foodController.getRandomFoodsByCode);





module.exports = router