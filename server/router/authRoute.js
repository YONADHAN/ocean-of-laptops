const express = require("express");
const router = express.Router();
const {
  refreshAccessToken,
  googleAuth,
  RemoveRefreshToken,
} = require("../controllers/authController");


// Routes
router.post("/refresh-token", refreshAccessToken); // Refresh token
router.post("/google", googleAuth);               // Google authentication
router.delete("/refresh-token/:id", RemoveRefreshToken);
console.log("ethiyitund")
module.exports = router;
