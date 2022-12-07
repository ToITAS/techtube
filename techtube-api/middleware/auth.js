const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];

    if (token !== "undefined") {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      if (decodedToken) {
        res.locals.user = decodedToken;
        next();
      } else {
        throw "Unauthorized";
      }
    } else {
      throw "Unauthorized";
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};
