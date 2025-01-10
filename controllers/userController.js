const User = require('../models/userModel');

exports.getUsers = async (request, response) => {
  const users = await User.find({});
  response.json(users);
};
