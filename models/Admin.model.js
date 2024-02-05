const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Create the admin model
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
