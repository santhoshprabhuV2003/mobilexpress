const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true, required: true },
  username: { type: String, required: true },
  phonenumber: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;