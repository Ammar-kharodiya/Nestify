const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");


app.use(cookieParser("secratecode"));

app.get("/setcookies", (req, res) => {
    res.cookie("name", "Ammar", {signed : true});
    res.cookie("color", "red", {signed : true});
    res.cookie("bird", "parrote", {signed : true});
    res.send("Hii we seted cookies");
});

app.get("/", (req, res) =>{
    console.dir(req.signedCookies);
    res.send("Hii we are on home route");
});

app.listen(3000, () => {
    console.log("app is listing on port 3000");
})
