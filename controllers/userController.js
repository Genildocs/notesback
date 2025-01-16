const User = require('../models/userModel');

exports.getUsers = async (request, response) => {
  const users = await User.find({});
  response.status(200).json({valid: true, user:users});
};
