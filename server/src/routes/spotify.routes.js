const express = require("express");
const router = express.Router();

router.get("/albums", (req, res) => res.json({ ok: true, route: "albums" }));
router.get("/artists", (req, res) => res.json({ ok: true, route: "artists" }));
router.get("/tracks", (req, res) => res.json({ ok: true, route: "tracks" }));

module.exports = router;
