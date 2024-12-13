const express = require("express");
const commonController = require("../controllers/common.controller");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.get(
  "/match/:id",
  authMiddleware,
  commonController.getMatchDetails
);

module.exports = router;