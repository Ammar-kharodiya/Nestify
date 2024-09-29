const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res, next) => {
    let listingReview = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listingReview.reviews.push(newReview);
    await newReview.save();
    await listingReview.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listing/${req.params.id}`);
};

module.exports.distroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
};