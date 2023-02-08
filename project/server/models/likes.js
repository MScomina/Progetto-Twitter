const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likesSchema = new Schema({
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

likesSchema.index({"message":1,"user":1}, {unique: true});

const Message = mongoose.model("Like", likesSchema);

module.exports = Message;