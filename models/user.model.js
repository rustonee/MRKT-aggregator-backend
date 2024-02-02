const mongoose = require("mongoose");

// Define the schema for the users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  avatarImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the user model
const User = mongoose.model("User", UserSchema);

module.exports = User;
