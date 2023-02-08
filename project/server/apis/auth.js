const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const json = require("express").json();

const User = require("../models/users.js");
const Credential = require("../models/credentials.js");



// POST /api/auth/signup

router.post("/signup", json, async function (req, res) {
    
    if(typeof req.body.username === "undefined" || typeof req.body.name === "undefined" || typeof req.body.surname === "undefined" || typeof req.body.description === "undefined" || typeof req.body.password === "undefined") {
        res.status(400).json({"error": "MissingFieldError", "message": "Missing fields in JSON!"});
        return;
    }
    
    const document = req.body;

    const newUser = User({
        "username": document.username,
        "name": document.name,
        "surname": document.surname,
        "description": document.description
    });

    const credentials = Credential({
        "username": document.username,
        "password": document.password
    });

    try {
        await newUser.save();
        await credentials.save();
    } catch(err) {
        if(err.name === "ValidationError") {
            res.status(400).json({"error": "ValidationError", "message": "There is a problem with the fields! Make sure to be within the range of length."});
            return;
        }
        if(err.code === 11000) {
            res.status(400).json({"error": "UsernameAlreadyTaken", "message": "There is already a username with that name!"});
            return;
        }
        res.status(500).json({"error": "InternalServerError", "message": "An error occourred!"});
        return;
    }

    res.status(201).json({"message": "The user has been registered successfully!"});
});



// POST /api/auth/signin

router.post("/signin", json, async function (req, res) {

    if(typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        res.status(400).json({"error": "MissingFieldError", "message": "Missing fields in JSON!"});
        return;
    }

    const document = req.body;

    const credentials = await Credential.findOne({"username" : {$eq: document.username}});

    if(credentials === null) {
        res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
        return;
    }

    bcrypt.compare(document.password, credentials.password, function(err, result) {
        if (result) {  
            const data = {"username": credentials.username};
            const secret = "I'm a teapot and i shouldn't be here. I should be secret.";
            const token = jwt.sign(data, secret, {expiresIn: 86400});   // Scade in 1 giorno!
            res.cookie("jwt", token, {"httpOnly": true, "sameSite": "strict"});
            res.status(200).json({"message":"Authenticated successfully!"});
            return;
        } else {
            res.status(400).send({"error": "IncorrectPasswordError", "message": "Password is not correct!"});
            return;
        }
    });

});  


module.exports = router;