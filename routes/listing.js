const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../contollers/listing');
const multer = require('multer');
const { storage } = require('../cloudconfig');
const upload = multer({ storage });


//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.newListing);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, upload.single('listing[image]'), wrapAsync (listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner,  wrapAsync(listingController.editListing));

//Update Route
router.put("/:id",isLoggedIn, upload.single('listing[image]'), validateListing, isOwner, wrapAsync (listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;