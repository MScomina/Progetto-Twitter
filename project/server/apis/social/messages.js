const router = require("express").Router();
const json = require("express").json();
const checkJWT = require("../../database_handler.js").checkJWT;

const User = require("../../models/users.js");
const Message = require("../../models/messages.js");



// POST /api/social/messages

router.post("/", json, async function(req, res) {

    const authData = checkJWT(req, res);
    if(typeof authData === "undefined") {
        return;
    }
    if(typeof req.body.message === "undefined") {
        res.status(400).json({"error": "MissingFieldError", "message": "Missing fields in JSON!"});
        return;
    }
    let response = {};
    try {
        user = await User.findOne({"username": {$eq: authData.username}});
        if(user === null) {
            res.status(404).json({"error": "NonExistantAuthenticatedUser", "message":"Authenticated user not in database? Report this."});
            return;
        }
        const message = Message({
            "message": req.body.message,
            "user": user
        });
        response = await message.save();
        const author = {
            "username" : response.user.username,
            "name" : response.user.name,
            "surname" : response.user.surname
        };
        response = { 
            "message" : response.message,
            "author" : author,
            "createdAt" : response.createdAt,
            "messageId" : response.messageId
        }
    } catch(err) {
        if(err.name === "ValidationError") {
            res.status(400).json({"error": "ValidationError", "message": "There is a problem with the fields! Make sure to be within the range of length."});
            return;
        }
        res.status(500).json({"error": "InternalServerError", "message": "An error occourred!"});
        return;
    }
    res.status(201).json(response);

});



// GET /api/social/messages/:userId

router.get("/:userId", async function(req, res) {

    const username = req.params.userId;
    const user = await User.findOne({"username" : {$eq: username}});

    let authData = checkJWT(req, res, false);
    if(typeof authData === "undefined") {
        authData = {
            "username" : ""
        };
    }

    if(user === null) {
        res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
        return;
    }

    //https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids
    //https://stackoverflow.com/questions/64391045/mongodb-mongoose-query-get-count-of-documents-by-reference
    const messages = await Message.aggregate([
        {
            $match: {"user" : user._id}
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "message",
                as: "likes"
            }
        },
        {
            $addFields: {
                numberOfLikes: {
                    $size: "$likes"
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "likes.user",
                foreignField: "_id",
                as: "likes.user"
            }
        },
        {
            $addFields: {
                liked: {
                    $in: [ authData.username, "$likes.user.username" ]
                }
            }
        },
        {
            $sort: {"createdAt" : -1}
        },
        {
            $limit: 500
        },
        {
            $project: {
                "messageId": 1,
                "message": 1,
                "createdAt": 1,
                "numberOfLikes": 1,
                "liked" : 1,
                "_id": 0
            }
        }
    ]);
    if(messages.length===0) {
        res.status(404).json({"error" : "NoMessageSent", "message": "That username has never sent any messages!"});
        return;
    }

    const author = {
        "username" : user.username,
        "name" : user.name,
        "surname" : user.surname
    };

    res.status(200).json({"messages" : messages, "author" : author});
});



// GET /api/social/messages/:userId/:msgId

router.get("/:userId/:msgId", async function(req, res) {

    const username = req.params.userId;
    const messageId = req.params.msgId;
    const user = await User.findOne({"username" : {$eq: username}});

    let authData = checkJWT(req, res, false);
    if(typeof authData === "undefined") {
        authData = {
            "username" : ""
        };
    }

    if(user === null) {
        res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
        return;
    }

    const message = await Message.aggregate([
        {
            $match: {"user" : user._id, "messageId" : messageId}
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "message",
                as: "likes"
            }
        },     
        {
            $addFields: {
                numberOfLikes: {
                    $size: "$likes"
                }
            }
        },  
        {
            $lookup: {
                from: "users",
                localField: "likes.user",
                foreignField: "_id",
                as: "likes.user"
            }
        }, 
        {
            $addFields: {
                liked: {
                    $in: [ authData.username, "$likes.user.username" ]
                }
            }
        },
        {
            $limit: 1
        },
        {
            $project: {
                "messageId": 1,
                "message": 1,
                "createdAt": 1,
                "numberOfLikes": 1,
                "liked" : 1,
                "author": {
                    "username" : user.username,
                    "name" : user.name,
                    "surname" : user.surname
                },
                "_id": 0
            }
        }
    ]);
    
    if(message.length === 0) {
        res.status(404).json({"error" : "MessageNotFound", "message": "Couldn't find that message!"});
        return;
    }
    res.status(200).json(message[0]);
});

module.exports = router;