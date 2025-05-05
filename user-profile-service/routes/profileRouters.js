const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/profile", authenticate, (req, res) => {
  const { name, email, phone } = req.user;
  res.json({ name, email, phone });
});

router.put("/profile", authenticate, async (req, res) => {
  const { name, phone } = req.body;
  req.user.name = name || req.user.name;
  req.user.phone = phone || req.user.phone;
  await req.user.save();
  res.json({ message: "Profile updated", user: req.user });
});

module.exports = router;
