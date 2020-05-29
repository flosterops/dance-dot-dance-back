const express = require("express");
const session = require("express-session");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const varMiddleware = require("./routes/middleware");

const app = express();
const databaseUrl = "mongodb://localhost:27017";

MongoClient.connect(databaseUrl, (err, client) => {
  if (err) {
    return console.log(err);
  }
  const dancersDB = client.db("dancers");

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();

    app.options("*", (req, res) => {
      // allowed XHR methods
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PATCH, PUT, POST, DELETE, OPTIONS"
      );
      res.send();
    });
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(
    session({
      secret: "kukumba",
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(varMiddleware);

  app.listen(8080, () => {
    routes(app, dancersDB);
  });
});
