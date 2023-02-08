const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followsSchema = new Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

followsSchema.index({"follower":1,"following":1}, {unique: true});

const Message = mongoose.model("Follow", followsSchema);

module.exports = Message;