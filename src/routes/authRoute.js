const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchUser");
require("dotenv").config();

//create a user using: POST "/api/auth/"  (REGISTER A USER)
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      res.status(400).json("user with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    const token = jwt.sign(user.id, process.env.JWT_SECRET);
    return res.status(200).json({ token, user });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "failed" });
  }
};

router.post(
  "/register",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  createUser
);

//create a user using: POST "/api/auth/"  (LOGIN A USER)
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Incorrect Credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ error: "Incorrect Credentials" });
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET);
    return res.status(200).json({ token, user });
  } catch {
    return res.status(500).json({ message: e.message, status: "failed" });
  }
};

router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password is required").exists(),
  ],
  loginUser
);

// get USER DETAILS using: POST "/api/auth/getuser". LOGIN REQUIRED
const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ message: e.message, status: "failed" });
  }
};

router.post("/getuser", fetchUser, getUser);

module.exports = router;
