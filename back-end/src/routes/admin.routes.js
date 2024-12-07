const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

const role = "ADMIN";

router.get(
  "/unapproved-users",
  authMiddleware,
  roleMiddleware(role),
  adminController.getUnapprovedUsers
);

router.put(
  "/approve-user",
  authMiddleware,
  roleMiddleware(role),
  adminController.approveUser
);

router.delete(
  "/delete-user",
  authMiddleware,
  roleMiddleware(role),
  adminController.deleteUser
);

router.post(
  "/seed-teams",
  authMiddleware,
  roleMiddleware(role),
  adminController.seedTeams
);

module.exports = router;
