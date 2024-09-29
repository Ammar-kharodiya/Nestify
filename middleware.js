const ExpressError = require("./utils/ExpressError.js");
const { listingScema } = require("./scema.js");
const { reviewSchema } = require("./scema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next)=> {
    if(!req.isAuthenticated()){        
        req.session.redirectUrl = req.originalUrl;        
        req.flash("error", "Login shhould be required !");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission!");
      return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, err, next) => {
    let { error } = listingScema.validate(req.body);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };

  module.exports.validateReview = (req, res, err, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };

  module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission!");
      return res.redirect(`/listing/${id}`);
    }
    next();
}