const express = require("express");
const publicController = require("../controllers/public.controller");

const router = express.Router();

router.get(
  "/get-matches",
  publicController.getAllMatches
);

router.get(
  "/get-match/:id",
  publicController.getMatchDetails
);

module.exports = router;