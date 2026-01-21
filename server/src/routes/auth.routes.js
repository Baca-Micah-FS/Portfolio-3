const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// OAuth
router.get("/login", authController.login);
router.get("/callback", authController.callback);

// Session status front end
router.get("/session", authController.session);

router.post("/logout", authController.logout);
router.get("/current-user", authController.getCurrentUser);

module.exports = router;
