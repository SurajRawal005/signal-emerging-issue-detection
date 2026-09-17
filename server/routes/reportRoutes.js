const express = require("express");

const {
  create,
  getAll,
  getMine,
  getOne,
  update,
  remove,
  analyze,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  authorizeRoles("ADMIN", "ANALYST", "REPORTER"),
  create
);

router.get(
  "/",
  authorizeRoles("ADMIN", "ANALYST"),
  getAll
);

router.get(
  "/mine",
  authorizeRoles("ADMIN", "ANALYST", "REPORTER"),
  getMine
);

router.get(
  "/analyze",
  authorizeRoles("ADMIN", "ANALYST"),
  analyze
);

router.get(
  "/:id",
  authorizeRoles("ADMIN", "ANALYST", "REPORTER"),
  getOne
);

router.put(
  "/:id",
  authorizeRoles("ADMIN", "ANALYST", "REPORTER"),
  update
);

router.delete(
  "/:id",
  authorizeRoles("ADMIN", "ANALYST", "REPORTER"),
  remove
);

module.exports = router;