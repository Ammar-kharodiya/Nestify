const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config(); 
const mapToken = process.env.MAP_TOKEN;
console.log(mapToken);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//database connection
const DB_URL = "mongodb://127.0.0.1:27017/wenderlust";
main()
  .then(() => {
    console.log("Conected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(DB_URL);
}

console.log(mapToken);

const initDb = async () => { 
  
  for (let listing of initData.data) {
      try {
          // Fetch geolocation data using Mapbox API
          const response = await geocodingClient.forwardGeocode({
              query: listing.location, // Assuming 'location' is the field in your listing
              limit: 1
          }).send();

          const geometry = response.body.features[0].geometry; // Get geometry from API response

          // Set the owner and attach the geometry to the listing
          const newListing = {
              ...listing,
              owner: "66e05b85365c7aef4f6a2bd8", // Hardcoded owner ID, adjust as needed
              geometry: geometry // Add the geocoded geometry
          };

          // Save to the database
          await Listing.create(newListing);
      } catch (err) {
          console.error(`Error geocoding listing: ${listing.name}`, err);
      }
  }
  console.log("Database initialized with geocoded listings.");
}

// Call the function to seed the database
initDb();
