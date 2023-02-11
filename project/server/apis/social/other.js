const router = require("express").Router();

const Follow = require("../../models/follows.js");
const Message = require("../../models/messages.js");
const User = require("../../models/users.js");
const checkJWT = require("../../database_handler.js").checkJWT;


// GET /api/social/users/:userId

router.get("/users/:userId", async function(req, res) {

    const username = req.params.userId;
    const user = await User.findOne({"username" : {$eq: username}});
    if(user === null) {
        res.status(404).json({"error" : "UsernameNotFound", "message": "Couldn't find that username!"});
        return;
    }

    let authData = checkJWT(req, res, false);
    if(typeof authData === "undefined") {
        authData = {
            "username" : ""
        };
    }
    let response = {
        "username" : user.username,
        "name" : user.name,
        "surname" : user.surname,
        "description" : user.description,
        "isFollowing" : false
    };
    const authUser = await User.findOne({"username" : {$eq: authData.username}});
    if(authUser === null) {
        res.status(200).json(response);
        return;
    }
    const follow = await Follow.findOne({"follower": authUser, "following" : user});
    delete user._id;
    if(follow !== null) {
        response.isFollowing = true;
    }
    res.status(200).json(response);
});



// GET /api/social/feed

router.get("/feed", async function(req, res) {

    const authData = checkJWT(req,res);
    if(typeof authData === "undefined") {
        return;
    }

    const user = await User.findOne({"username" : {$eq: authData.username}});

    if(user === null) {
        res.status(404).json({"error": "NonExistantAuthenticatedUser", "message":"Authenticated user not in database? Report this."});
        return;
    }

    //https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids
    //https://stackoverflow.com/questions/64391045/mongodb-mongoose-query-get-count-of-documents-by-reference
    const followedUsersIds = await Follow.aggregate([
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
            $group: {
                _id: null,
                followedUsersIds: { $push: "$following._id" }
            }
        },
        {
            $project: {
                "followedUsersIds": 1,
                "_id": 0
            }
        }
    ]);
    if(followedUsersIds.length === 0) {
        res.status(404).json({"error" : "NoFollowersFound", "message" : "No messages appeared in your feeds!"});
        return;
    }
    const messages = await Message.aggregate([
        {
            $match: { 
                "user" : {$in : followedUsersIds[0].followedUsersIds}
            }
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
              localField: "user",
              foreignField: "_id",
              as: "user"
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
            $unwind: "$user"
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
                "author": {
                    "username" : "$user.username",
                    "name" : "$user.name",
                    "surname" : "$user.surname"
                },
                "liked": 1,
                "_id": 0
            }
        }
    ]);

    if(messages.length === 0) {
        res.status(404).json({"error" : "NoMessagesFound", "message" : "No messages appeared in your feeds!"});
        return;
    }

    res.status(200).json({"messages": messages});

});



// GET /api/social/whoami

router.get("/whoami", async function(req, res) {

    const authData = checkJWT(req, res);
    if(typeof authData === "undefined") {
        return;
    }
    
    const user = await User.findOne({"username" : {$eq: authData.username}}, "username name surname description -_id");

    if(user === null) {
        res.status(404).json({"error": "NonExistantAuthenticatedUser", "message":"Authenticated user not in database? Report this."});
        return;
    }

    res.status(200).json(user);
});



// GET /api/social/search?q=query

router.get("/search", async function(req, res) {

    const query = req.query.q.toLowerCase();

    let authData = checkJWT(req, res, false);
    if(typeof authData === "undefined") {
        authData = {
            "username" : ""
        };
    }

    let userAuth = await User.findOne({"username" : { $eq: authData.username }});
    if(userAuth === null) {
        userAuth = {
            "_id": ""
        };
    }

    const users = await User.aggregate([
        {
            $match: {
                $or: [
                    { "username": { $regex: `.*${query}.*`, $options: 'i' } },
                    { "name": { $regex: `.*${query}.*`, $options: 'i' } },
                    { "surname": { $regex: `.*${query}.*`, $options: 'i' } }
                ]
            }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "follow"
            }
        },
        {
            $addFields: {
                follow: {
                    $filter: {
                        input: "$follow",
                        as: "f",
                        cond: {
                            $eq: [ "$$f.follower", userAuth._id ]
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                isFollowing: {
                    $gt: [ { $size: "$follow" }, 0 ]
                }
            }
        },
        {
            $limit: 20
        },
        {
            $project: {
                "username" : 1,
                "name" : 1,
                "surname" : 1,
                "description" : 1,
                "isFollowing": 1,
                "_id" : 0
            }
        }
    ]);

    if(users.length === 0) {
        res.status(404).json({"error" : "NoUsersFound", "message" : "No users matched your query!"});
        return;
    }

    res.status(200).json({"users" : users});
});

module.exports = router;