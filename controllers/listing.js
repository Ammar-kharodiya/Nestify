const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    try {
        const allListingData = await Listing.find({});
        res.render("listing/index", { allListingData });
    } catch (err) {
        next(err);
    }
};

module.exports.search = async (req, res, next) => {
    try {
        let destination = req.query.search;
        if (!destination || !destination.trim().length) {
            return res.redirect("/listing");
        }
        let allListingData = await Listing.find({
            $or: [
                { location: { $regex: destination, $options: "i" } }, // Match location
                { country: { $regex: destination, $options: "i" } }     // Match state
            ]
        });
        if (!allListingData.length) {           
            req.flash("error", `Listing isn't available at ${destination}`);
            return res.redirect("/listing");
        }
        res.render("listing/index", { allListingData });
    } catch (err) {
        next(err);
    }
};

module.exports.renderNewListing = (req, res, next) => {
    res.render("listing/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    let saveListing = await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listing");
};

module.exports.renderUpdate = async (req, res, next) => {
    let { id } = req.params;

    const selectedData = await Listing.findById(id);
    if (!selectedData) {
        req.flash("error", "Listing Not Found");
        return res.redirect("/listing");
    }
    let originalUrl = selectedData.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_250");
    console.log(originalUrl);
    res.render("listing/edit.ejs", { selectedData, originalUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing you requested for does not exist");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const selectedData = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!selectedData) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listing");
    }
    res.render("listing/show", { selectedData });
};