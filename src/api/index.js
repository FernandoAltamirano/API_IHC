const { database, SECRET_SESSION } = require("../config");
const express = require("express");
const routes = require("./routes");
const session = require("express-session");
const mysqlStore = require("express-mysql-session");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
//INITIALIZATIONS
const app = express();
app.use(cors());
//MIDDLEWARES
app.use(
  session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database),
    cookie: { secure: false, httpOnly: false },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//ROUTES
app.use(routes);

//EXPORTING
module.exports = app;
