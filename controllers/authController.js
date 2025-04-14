const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { promisify } = require('util');
const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

exports.userLogin = async (request, response) => {
  try {
    const { email, password } = await loginSchema.validateAsync(request.body);

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
    if (error.isJoi) {
      return response.status(400).json({ error: error.message });
    }
    response.status(500).json({ message: 'Access denied' });
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
// Users
exports.isAuth = async (req, res, next)=>{
  const token = req.headers.authorization?.split(' ')[1]
  if(!token) return res.status(401).json({message: "Token not provided"})
  try {
      //verificar se o token eh valido
      const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET)
      //verifica se o usuario existe
      const currentUser = await User.findById(decodedToken.userId)
      if(!currentUser) return next(res.status(401).json({message: 'Not authorized'}))

      req.user = currentUser
      next()
  }catch (error){
    res.status(401).json({message: "Invalid token"})
  }
}
//Administrator
exports.isAdmin = async (req, res, next)=>{
  const user = await User.findById(req.user)
  if(user?.role !== 'admin')return res.status(403).json({message: "Access denied: administrators only"})
  next()
}