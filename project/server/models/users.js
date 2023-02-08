const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20,
        match: /^[-_.a-zA-Z0-9]+$/
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        match: /^[a-zA-Z\s]+$/
    },
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        match: /^[a-zA-Z\s]+$/
    },
    description: {
        type: String,
        default: "",
        maxlength: 200
    }
}, {timestamps: true});


// Sanitization of inputs.
userSchema.pre("save", function(next) {
    for (let key in this._doc) {
      if (typeof this._doc[key] === "string") {
          this._doc[key] = sanitizeHtml(this._doc[key]);
      }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;