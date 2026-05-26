// import controllers review, products
const controller = require("../controllers/authController.js");

// router
const router = require("express").Router();

router.post("/login", controller.login);
router.get("/check/token", controller.checkToken);

module.exports = router;
