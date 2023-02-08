const express = require("express");
const apiRouter = express.Router();
const socialRouter = express.Router();
const authRouter = require("./auth.js");
const followersRouter = require("./social/followers.js");
const likeRouter = require("./social/like.js");
const messagesRouter = require("./social/messages.js");
const otherRouter = require("./social/other.js");


socialRouter.use("/messages", messagesRouter);
socialRouter.use("/followers", followersRouter);
socialRouter.use("/like", likeRouter);
socialRouter.use("/", otherRouter);

apiRouter.use("/auth", authRouter);
apiRouter.use("/social", socialRouter);

module.exports = apiRouter;