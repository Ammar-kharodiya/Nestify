const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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


const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner : "66e05b85365c7aef4f6a2bd8"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was saved");
}

initDb();