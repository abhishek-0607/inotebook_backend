const jwt = require("jsonwebtoken");
require("dotenv").config();
const fetchUser = (req, res, next) => {
  //get the user from jwt token and add id to req object

  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({
      error: "please authenticate using a valid token",
    });
  }
  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (e) {
    res.status(401).send({
      e: "please authenticate using a valid token",
    });
  }
};
module.exports = fetchUser;
