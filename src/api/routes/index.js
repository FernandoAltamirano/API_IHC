const auth = require("./auth")
const home = require("./home")
const dashboard = require("./dashboard")
const dashboardAdmin = require("./dashboardAdmin")
const express = require("express")
const router = express.Router()


//ROUTES
router.use("/auth", auth)
router.use("/home", home)
router.use("/dashboard", dashboard)
router.use("/dashboardAdmin", dashboardAdmin)


//EXPORT
module.exports = router