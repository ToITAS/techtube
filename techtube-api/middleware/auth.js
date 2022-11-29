const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token !== "undefined") {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      if (decodedToken) {
        res.locals.user = decodedToken;
        next();
      } else {
        throw "Unauthorized";
      }
    } else {
      throw "Unauthorized"
    }
  } catch (e) {
    res.status(401).json({
      error: "Unauthorized"
    });
  }
};
