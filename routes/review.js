const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//review route
router.post("/", isLoggedIn, validateReview,
  wrapAsync(reviewController.createReview)
);

//delete route
router.delete("/:reviewId", isReviewAuthor,
  wrapAsync(reviewController.distroyReview)
);


module.exports = router;