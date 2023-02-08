const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    messageId: {
        type: String,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

// Sanitization of inputs.
messagesSchema.pre("save", function(next) {
    for(let key in this._doc) {
        if(typeof this._doc[key] === "string" && key !== "messageId") {
            this._doc[key] = sanitizeHtml(this._doc[key]);
        }
    }
    next();
});

messagesSchema.pre("save", function(next) {
    if(this.isNew) {
        this.messageId = uuidv4();
    }
    next();
});


const Message = mongoose.model("Message", messagesSchema);

module.exports = Message;