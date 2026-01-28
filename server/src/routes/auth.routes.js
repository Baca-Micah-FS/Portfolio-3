const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const middleWare = require("../middleware/requireAuth");

// OAuth
router.get("/login", authController.login);
router.get("/callback", authController.callback);

router.get(
  "/session",
  middleWare.testMiddleware,
  middleWare.refresh,
  authController.session
);

// router.post("/refresh", authController.refresh);
router.get("/token-status", authController.tokenStatus);

router.post("/logout", authController.logout);
router.get(
  "/current-user",

  authController.getCurrentUser
);

router.get("/session-test", (req, res) => {
  res.status(200).json({ message: req.session });
});

module.exports = router;
