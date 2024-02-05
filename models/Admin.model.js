const mongoose = require("mongoose");

// Define the schema for the admin
const AdminSchema = new mongoose.Schema({
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

// Create the admin model
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
