const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const url = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/social_network";
const secret = process.env.SECRET_JWT || "I'm a teapot and i shouldn't be here. I should be secret.";

async function openConnection() {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}

async function closeConnection() {
    try {
      await mongoose.connection.close;
      console.log("Successfully closed MongoDB connection!");
    } catch (error) {
      console.log("Error:", error);
    }
}

function checkJWT(req, res, shouldRespond=true) {
  if(typeof req.cookies.jwt === "undefined") {
    if(shouldRespond) res.status(401).json({"error": "AuthenticationError", "message": "You are not authenticated!"});
    return;
  }

  let authData;
  try {
      authData = jwt.verify(req.cookies.jwt, secret); 
  } catch(err) {
      if(err instanceof jwt.TokenExpiredError) {
          if(shouldRespond) res.status(401).json({"error": "ExpiredJWTError", "message": "The JWT token has expired!"});
          return;
      }
      if(shouldRespond) res.status(401).json({"error": "InvalidJWTError", "message": "The JWT token is invalid!"});
      return;
  }
  return authData;
}

module.exports = {
  openConnection,
  closeConnection,
  checkJWT
};