const express = require("express");
const publicController = require("../controllers/public.controller");

const router = express.Router();

router.get(
  "/get-matches",
  publicController.getAllMatches
);

module.exports = router;