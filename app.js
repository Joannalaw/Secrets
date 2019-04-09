//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));


app.use(bodyParser.urlencoded({
    extended: true
}));
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });



const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// const secret = "Thisisourlittlesecret"    use dotenv
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
// userSchema.plugin(encrypt, { secret: secret });



const User = new mongoose.model("User", userSchema);

app.set("view engine", "ejs");


app.get("/", function (req, res) {
    res.render("home");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    })
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000, function (req, res) {
    console.log("Server is running on Port 3000.")
})