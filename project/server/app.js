const express = require("express");
const api = require("./apis/api.js");
const db_handler = require("./database_handler.js");
const cookieParser = require("cookie-parser");
const path = require("path");


const app = express();
const port = 3000;


async function startup() {
  
  await db_handler.openConnection();

  process.on("SIGINT", async function() {
    await db_handler.closeConnection();
  });

  app.use(cookieParser());

  
  app.use(express.static(path.join(__dirname, "..", "public/dist")));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
    } else {
      res.sendFile(path.join(__dirname, "..", "public/dist", "index.html"));
    }
  });

  app.use("/api", api);

  app.listen(port, () => {
    console.log(`In ascolto sulla porta ${port}!`);
  });
  return;
}

async function main() {
  await startup();
}

main();