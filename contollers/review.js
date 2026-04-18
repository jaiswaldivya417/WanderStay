const Review = require('../MODELS/review');
const Listing = require('../MODELS/listing');
const ExpressError = require('../utils/ExpressError');

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  let review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  console.log(review);
  review = await Review.findById(review._id).populate('author');
  listing.reviews.push(review);
  await listing.save();
  req.flash("success", "New review added!");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
}