const router = require("express").Router();
const restaurantController = require("../controllers/restaurantController");


// CREATE RESTAURANT
router.post("/",  restaurantController.addRestaurant);


// Sevices availability
router.patch("/:id", restaurantController.serviceAvailability);



// GET RESTAURANT BY ID
router.get("/:code", restaurantController.getRandomRestaurants);


// GET RESTAURANT BY ID
router.get("/all/:code", restaurantController.getAllRandomRestaurants);

// // GET ALL RESTAURANT
router.get("/byId/:id", restaurantController.getRestaurant);





module.exports = router