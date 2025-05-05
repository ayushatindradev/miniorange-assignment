const express = require("express");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");
const router = express.Router();

// Form-based Registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  res.json({ message: "User registered", user });
});

// Form-based Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = generateToken(user);
  res.json({ token });
});

// Google OAuth
router.post("/auth/google", async (req, res) => {
  const { token } = req.body; // front-end should send Google ID token
  const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
  const { email, sub, name } = response.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, googleId: sub, name });
  }
  const jwtToken = generateToken(user);
  res.json({ token: jwtToken });
});

// Facebook OAuth
router.post("/auth/facebook", async (req, res) => {
  const { accessToken, userID } = req.body;
  const response = await axios.get(
    `https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`
  );
  const { email, name, id } = response.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, facebookId: id, name });
  }
  const jwtToken = generateToken(user);
  res.json({ token: jwtToken });
});

module.exports = router;
