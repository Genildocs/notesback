const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.userLogin = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: '12h' }
    );

    response
      .status(200)
      .json({ message: 'user logged in', token, username: user.username });
  } catch (error) {}
};

exports.userRegister = async (request, response, next) => {
  try {
    const { email, username, password } = request.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return response.status(400).json({
        error: 'email already in use',
      });
    }

    const user = new User({ email, username, password });

    await user.save();

    response.status(201).json({ message: 'user created' });
  } catch (error) {
    next(error);
  }
};
