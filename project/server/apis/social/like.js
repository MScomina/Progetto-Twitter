const router = require("express").Router();
const checkJWT = require("../../database_handler.js").checkJWT;
const User = require("../../models/users.js");
const Message = require("../../models/messages.js");
const Like = require("../../models/likes.js");

// POST /api/social/like/:msgId

router.post("/:msgId", async function(req, res) {

    const messageId = req.params.msgId;

    const authData = checkJWT(req, res);
    if(typeof authData === "undefined") {
        return;
    }

    const message = await Message.findOne({"messageId" : {$eq: messageId}});
    if(message === null) {
        res.status(404).json({"error" : "MessageNotFound", "message": "Couldn't find that message!"});
        return;
    }
    const user = await User.findOne({"username" : {$eq : authData.username}});
    if(user === null) {
        res.status(404).json({"error": "NonExistantAuthenticatedUser", "message":"Authenticated user not in database? Report this."});
        return;
    }

    const like = Like({
        "message" : message,
        "user" : user
    });
    try {
        await like.save();
    } catch(err) {
        if(err.name === "ValidationError") {
            res.status(400).json({"error": "ValidationError", "message": "There is a problem with the fields! Make sure to be within the range of length."});
            return;
        }
        if(err.code === 11000) {
            res.status(400).json({"error": "AlreadyLiking", "message": "You already liked this message!"});
            return;
        }
        res.status(500).json({"error": "InternalServerError", "message": "An error occourred!"});
        return;
    }

    res.status(201).json({"message" : "The message has been liked correctly!"});
    
});



// DELETE /api/social/like/:msgId

router.delete("/:msgId", async function(req, res) {

    const messageId = req.params.msgId;

    const authData = checkJWT(req, res);
    if(typeof authData === "undefined") {
        return;
    }

    const message = await Message.findOne({"messageId" : {$eq: messageId}});

    if(message === null) {
        res.status(404).json({"error" : "MessageNotFound", "message": "Couldn't find that message!"});
        return;
    }

    const user = await User.findOne({"username" : {$eq : authData.username}});

    if(user === null) {
        res.status(404).json({"error": "NonExistantAuthenticatedUser", "message":"Authenticated user not in database? Report this."});
        return;
    }

    try {

        const result = await Like.findOneAndDelete({"message" : message, "user" : user});
        if(result === null) {
            res.status(404).json({"error" : "NotLikingError", "message": "You don't like this message already!"});
            return;
        }

    } catch(err) {

        res.status(500).json({"error": "InternalServerError", "message": "An error occourred!"});
        return;

    }

    res.status(200).json({"message" : "You don't like the message anymore!"});

});

module.exports = router;