const router = require("express").Router();

const User = require("../../models/users.js");
const Follow = require("../../models/follows.js");
const checkJWT = require("../../database_handler.js").checkJWT;



// GET /api/social/followers/:userId

router.get("/:userId", async function(req, res) {

    const username = req.params.userId;
    const user = await User.findOne({"username" : {$eq : username}});
    if(user === null) {
        res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
        return;
    }

    const follows = await Follow.aggregate([
        {
            $match: {"follower" : user._id}
        },
        {
            $lookup: {
                from: "users",
                localField: "following",
                foreignField: "_id",
                as: "following"
            }
        },
        {
            $unwind: "$following"
        },
        {
            $addFields: {
                "username" : "$following.username",
                "name" : "$following.name",
                "surname" : "$following.username",
                "description" : "$following.description"
            }
        },
        {
            $sort: {"username" : 1}
        },
        {
            $project: {
                "username" : 1,
                "name" : 1,
                "surname" : 1,
                "description" : 1,
                "_id": 0
            }
        }
    ]);
    if(follows.length === 0) {
        res.status(404).json({"error" : "NoFollowing", "message": "That username isn't following anybody!"})
        return;
    }

    res.status(200).json({"following" : follows});
});



// POST /api/social/followers/:userId

router.post("/:userId", async function(req, res) {

    const username = req.params.userId;
    
    const authData = checkJWT(req, res);
    if(typeof authData === "undefined") {
        return;
    }
    
    try {

        const follower = await User.findOne({"username": {$eq: authData.username}});

        if(follower === null) {
            res.status(404).json({"error": "NonExistantAuthenticatedUser", "message": "Authenticated user not in database? Report this."});
            return;
        }

        const following = await User.findOne({"username": {$eq: username}});

        if(following === null) {
            res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
            return;
        }

        const follow = Follow({
            "follower" : follower,
            "following" : following
        });

        await follow.save();

    } catch(err) {
        if(err.code === 11000) {
            res.status(400).json({"error": "AlreadyFollowingError", "message": "You are already following that user!"});
            return;
        }
        res.status(500).json({"error": "InternalServerError", "message": "An error occourred!"});
        return;
    }

    res.status(201).json({"message": "The user has been followed correctly!"});
});



// DELETE /api/social/followers/:userId

router.delete("/:userId", async function(req, res) {

    const username = req.params.userId;

    const authData = checkJWT(req, res);
    if(typeof authData === "undefined") {
        return;
    }

    const follower = await User.findOne({"username": {$eq: authData.username}});

    if(follower === null) {
        res.status(404).json({"error": "NonExistantAuthenticatedUser", "message": "Authenticated user not in database? Report this."});
        return;
    }

    const following = await User.findOne({"username": {$eq: username}});

    if(following === null) {
        res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
        return;
    }

    try {

        const result = await Follow.findOneAndDelete({"follower" : follower, "following" : following});
        if(result === null) {
            res.status(404).json({"error" : "NotFollowingError", "message": "You are not following that user!"});
            return;
        }

    } catch(err) {

        res.status(500).json({"error": "InternalServerError", "message": "An error occourred!"});
        return;

    }

    res.status(200).json({"message" : "The user has been unfollowed correctly!"});

});

module.exports = router;