const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../MODELS/review');
const { validateReview, isLoggedIn } = require('../middleware');
const rewiewController = require('../contollers/review');


//Create Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(rewiewController.createReview));

//Create Review Delete Route
router.delete("/:reviewId",isLoggedIn, wrapAsync(rewiewController.deleteReview));

module.exports = router;