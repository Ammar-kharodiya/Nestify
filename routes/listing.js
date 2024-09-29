const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../clouldConfig.js");
const upload = multer({ storage })


router.route("/")
.get(wrapAsync( listingController.index))   //show all listing
.post(isLoggedIn, upload.single('listing[image]'), validateListing,     //create new listing
  wrapAsync(listingController.createListing)
);



//Render new listing
router.get("/new", isLoggedIn, listingController.renderNewListing);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.renderUpdate)
);


router.route("/:id")
.put(isLoggedIn, isOwner,  upload.single('listing[image]'), validateListing,   //update route
  wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,isOwner,        //delete route
  wrapAsync(listingController.destroyListing)
)
.get(                      //Show specific listing
  wrapAsync(listingController.showListing)
);

module.exports = router;
