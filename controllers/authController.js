const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { promisify } = require('util');

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
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

exports.protectRouter = async (request, response, next) => {
  //verificar se o token existe
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer ')
  ) {
    token = request.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(response.status(401).json({ message: 'not authorized' }));
  }

  //verificar se o token eh valido
  const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET);

  //verificar se o usuario existe
  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(response.status(401).json({ message: 'not authorized' }));
  }

  request.user = currentUser;
  next();
};
