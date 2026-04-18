const Listing = require('../MODELS/listing');
const mongoose = require('mongoose');
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Listing not found", 404));
  }

  const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: "author"}}).populate('owner');
  
  if (!listing) {
    return next(new ExpressError("Listing not found", 404));
  }

  res.render("listings/show.ejs", { listing });
}

module.exports.createListing =  async(req, res,next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let result = listingSchema.validate(req.body);
  console.log(result);
  if(result.error){
    throw new ExpressError(400, result.error);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image.url = url;
  newListing.image.filename = filename;
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
}

module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError("Listing not found", 404));
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace(/\/upload\//, '/upload/h_300,w_250/'); // Adjust the URL for a smaller image
  res.render("listings/edit.ejs", { listing, originalImage });
}

module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
    throw new ExpressError("Invalid Listing Data",400);
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
  if(typeof req.file !== 'undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image.url = url;
    listing.image.filename = filename;
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}