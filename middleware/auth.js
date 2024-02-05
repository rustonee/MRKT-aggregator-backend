const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticationMiddleware = (req, res, next) => {
  const secretKey = process.env.TOKEN_SECRET;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please add valid token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please add valid token" });
  }

  return next();
};

module.exports = authenticationMiddleware;
