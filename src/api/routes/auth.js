const db = require("../../database/index");
const helpers = require("../middlewares/helpers");
const { SECRET_TOKEN } = require("../../config");
const jwt = require("jsonwebtoken");
const { Router } = require("express");

//INITIALIZATION
const router = Router();

//ESTA ES LA PESTAÑA DE LOGIN
// router.get("/login", (req, res) => {
//   res.send("Login Page");
// });

//ESTA RUTA RECIBE LOS DATOS DEL FORMULARIO Y LOS COMPARA CON LOS DE LA BD
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const rows = await db.query(
    "SELECT id, password FROM usuarios WHERE email = ?",
    [email]
  );
  if (rows.length > 0) {
    const user = rows[0];
    const validate = await helpers.matchPassword(password, user.password);
    if (validate) {
      const token = jwt.sign({ id: user.id }, SECRET_TOKEN);
      req.session.jwt = token;
      //   res.redirect("/dashboard/profile")
      return res.json({ data: token });
    } else {
      res
        .status(400)
        .json({ data: null, messaage: "Your password is invalidated" });
    }
  } else {
    res.status(400).json({ data: null, message: "Your email is not exists" });
  }
});

//ESTA ES LA PESTAÑA DE SIGNUP
// router.get("/signup", (req, res) => {
//   res.send("Signup Page");
// });

//RECIBE LOS DATOS DEL FORMULARIO REGISTRO USUARIO Y LOS AGREGA A LA BD
router.post("/signup", async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;
  const newUser = { nombre, apellidos, email, password };
  newUser.password = await helpers.encryptPassword(password);

  await db.query("INSERT INTO usuarios SET ?", [newUser], (err, result) => {
    if (err) return res.json({ data: null, message: "Register error" });
    res.json({ data: "", message: "Register was successful" });
    // res.redirect("/dashboard/profile");
  });
});

//LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();

  // res.redirect("/auth/login");
});

//EXPORTING AUTH ROUTES
module.exports = router;
