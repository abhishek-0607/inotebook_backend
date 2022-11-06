const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

//create a user using: POST "/api/auth/"
router.post(
  "/register",
  [
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        res.status(400).json("user with this email already exists");
      }
      user = await User.create(req.body);
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "failed" });
    }
  }
);
module.exports = router;
