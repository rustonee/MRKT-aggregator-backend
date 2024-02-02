const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

// Admin login
exports.login = async (req, res) => {
  const secretKey = process.env.TOKEN_SECRET;

  const username = req.body.username;
  const password = req.body.password;

  try {
    // const user = await User.findOne({ username: username });

    // for test
    const user = {
      username: "admin",
      password: await bcrypt.hash("admin", 10),
    };
    console.log(await bcrypt.compare(password, user.password));
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, role: user.role };
      const expiresIn = "1h"; // Token expiration time

      const accessToken = jwt.sign(payload, secretKey, { expiresIn });

      res.json({ accessToken });

      return;
    }

    res.status(400).json({
      message: "Invalid user.",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error occurred while authenticating.",
    });
  }
};
