const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin.model");

// Admin login
exports.login = async (req, res) => {
  const secretKey = process.env.TOKEN_SECRET;
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message:
        "Bad request. Please add username and password in the request body",
    });
  }

  try {
    const foundUser = await Admin.findOne({ username: username });

    if (foundUser) {
      const isMatch = await comparePassword(password, foundUser.password);
      if (isMatch) {
        const token = jwt.sign(
          {
            id: foundUser._id,
            name: foundUser.username,
          },
          secretKey,
          { expiresIn: "30d" }
        );

        return res.status(200).json({ message: "user logged in", token });
      } else {
        return res.status(401).json({ message: "Bad password" });
      }
    } else {
      return res.status(401).json({ message: "Bad credentails" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error occurred while authenticating.",
    });
  }
};

const comparePassword = async (candidatePassword, password) => {
  const isMatch = await bcrypt.compare(candidatePassword, password);
  return isMatch;
};
