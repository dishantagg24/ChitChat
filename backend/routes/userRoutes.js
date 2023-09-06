const express = require("express");
const { registerUser, allUsers, authUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", registerUser);
router.get("/", protect, allUsers);
router.get("/login", authUser);

module.exports = router;