if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const mongoStore = require('connect-mongo');
const flash = require("connect-flash");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStarategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//database connection
//const DB_URL = "mongodb://127.0.0.1:27017/wenderlust";
const DB_URL = process.env.ATLASDB_URL;
mongoose.connect(DB_URL, {
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000,
})
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

const store = mongoStore.create({
  mongoUrl : DB_URL,
  crypto: {
    secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600
})

store.on("error", () => {
  console.log("Eroor occure in store session", err);
})
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStarategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//All Routes
app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/", userRouter);

//Middlewares
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found !"));
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log(err);
  res.status(statusCode).render("listing/error.ejs", { message });
})


app.listen(3000, () => {
  console.log("App is listing ");
});
