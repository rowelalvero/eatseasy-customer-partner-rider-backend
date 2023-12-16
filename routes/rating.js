const router = require("express").Router();
const ratingController = require("../controllers/ratingController");
const {verifyTokenAndAuthorization}= require("../middlewares/verifyToken")

// UPADATE USER
router.post("/",verifyTokenAndAuthorization, ratingController.addRating);

module.exports = router;