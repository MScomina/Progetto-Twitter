const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const sanitizeHtml = require("sanitize-html");

const credentialsSchema = new Schema({
    username: {
        type: String,
        ref: "User",
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    }
});

// Hashing of credentials before inserting into database.
credentialsSchema.pre("save", function(next) {
    const credentials = this;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(credentials.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            } 
            credentials.password = hash;
            next();
        });
    });
});

// Sanitization of inputs.
credentialsSchema.pre("save", function(next) {
    for (let key in this._doc) {
      if (typeof this._doc[key] === "string" && key !== "password") {
          this._doc[key] = sanitizeHtml(this._doc[key]);
      }
  }
  next();
});

const Credential = mongoose.model("Credential", credentialsSchema);

module.exports = Credential;