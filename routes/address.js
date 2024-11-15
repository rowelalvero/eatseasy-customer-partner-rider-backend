const router = require("express").Router();
const addressController = require("../controllers/addressController");
const { verifyTokenAndAuthorization, verifyAdmin } = require("../middlewares/verifyToken");
const { getDirections } = require("../controllers/addressController"); // Import the new getDirections method

// UPADATE USER
router.post("/", verifyTokenAndAuthorization, addressController.createAddress);

// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, addressController.deleteAddress);

// GET USER
router.get("/default", verifyTokenAndAuthorization, addressController.getDefaultAddress);

// GET ALL ADDRESSES FOR USER
router.get("/all", verifyTokenAndAuthorization, addressController.getUserAddresses);

// UPDATE ADDRESS
router.put("/:id", verifyTokenAndAuthorization, addressController.updateAddress);

// SET DEFAULT ADDRESS
router.patch("/default/:address", verifyTokenAndAuthorization, addressController.setDefaultAddress);

// NEW ROUTE: GET DIRECTIONS FROM GOOGLE MAPS API (PROXY)
router.post("/directions", verifyTokenAndAuthorization, getDirections); // Add the new route here

module.exports = router;
