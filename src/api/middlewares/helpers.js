const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../database");
const { SECRET_TOKEN } = require("../../config");
const helpers = {};

//FUNCTIONS
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);

  const password_hash = bcrypt.hash(password, salt);

  return password_hash;
};

helpers.matchPassword = async (password, savedPassword) => {
  return await bcrypt.compare(password, savedPassword);
};

helpers.isLoggedIn = async (req, res, next) => {
  const token = req.headers["token"];
  // const token = req.session.jwt;
  if (token) {
    try {
      const decode = await jwt.verify(token, SECRET_TOKEN);
      const query =
        "SELECT id, nombre, apellidos, email, tipo_usuario, edad, celular, sexo, ocupacion, foto FROM usuarios WHERE id = ?";
      const result = await db.query(query, [decode.id]);
      if (!result)
        return res
          .status(500)
          .json({ data: null, message: "The user already not exists" });
      req.user = result[0];
      console.log(req.user);
      return next();
    } catch (err) {
      console.log("ERROR");
    }
  } else {
    // return res.redirect("/auth/login");
    return res.json({ data: null, message: "You don't have an authorization" });
  }
};

helpers.isLoggedInAdmin = async (req, res, next) => {
  if (req.user.tipo_usuario === "S") {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
};

helpers.completeUserData = async (req, res, next) => {
  const query =
    "SELECT edad, celular, sexo, ocupacion FROM usuarios WHERE id = ?";

  const rows = await db.query(query, [req.user.id]);

  if (
    rows[0].edad != null &&
    rows[0].celular != null &&
    rows[0].sexo != null &&
    rows[0].ocupacion != null
  ) {
    return next();
  } else {
    return res.status(400).json({ message: "User Data Imcomplete" });
  }
};

module.exports = helpers;
