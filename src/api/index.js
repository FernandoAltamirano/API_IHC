const { database } = require("../config");
const express = require("express");
const routes = require("./routes");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
//INITIALIZATIONS
const app = express();
app.use(cors());
//MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//ROUTES
app.use(routes);

//EXPORTING
module.exports = app;
