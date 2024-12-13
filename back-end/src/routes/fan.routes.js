const express = require("express");
const fanController = require("../controllers/fan.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  openSessionValidation,
  closeSessionValidation,
  reserveSeatValidation,
  completeReservationValidation,
  cancelSeatReservationValidation,
} = require("../validators/fan.validator");
const handleValidationErrors = require("../middleware/validationMiddleware");

const router = express.Router();

const role = "FAN";

router.post(
  "/open-session",
  authMiddleware,
  roleMiddleware(role),
  openSessionValidation,
  handleValidationErrors,
  fanController.openSession
);

router.put(
  "/close-session",
  authMiddleware,
  roleMiddleware(role),
  closeSessionValidation,
  handleValidationErrors,
  fanController.closeSession
);

router.post(
  "/reserve-seat",
  authMiddleware,
  roleMiddleware(role),
  reserveSeatValidation,
  handleValidationErrors,
  fanController.reserveSeat
);

router.post(
  "/cancel-seat-reservation",
  authMiddleware,
  roleMiddleware(role),
  reserveSeatValidation,
  handleValidationErrors,
  fanController.cancelSeatReservation
)

router.post(
  "/complete-reservation",
  authMiddleware,
  roleMiddleware(role),
  completeReservationValidation,
  handleValidationErrors,
  fanController.completeReservation
)

router.get(
  "/reservations",
  authMiddleware,
  roleMiddleware(role),
  fanController.getReservations
)

router.delete(
  "/reservation",
  authMiddleware,
  roleMiddleware(role),
  fanController.deleteReservation
)

module.exports = router;
