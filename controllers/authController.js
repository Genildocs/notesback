const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { promisify } = require('util');
const Joi = require('joi');
const AppError = require('../utils/AppError');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

exports.userLogin = async (request, response, next) => {
  try {
    const { email, password } = await loginSchema.validateAsync(request.body);

    // Busca usuário e inclui campos sensíveis
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

    if (!user) {
      return next(new AppError('Email ou senha inválidos', 401));
    }

    // Verifica se a conta está bloqueada
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return next(new AppError(`Conta bloqueada. Tente novamente em ${timeLeft} minutos.`, 401));
    }

    // Verifica senha
    if (!(await user.comparePassword(password))) {
      await user.incrementLoginAttempts();
      return next(new AppError('Email ou senha inválidos', 401));
    }

    // Reset das tentativas de login em caso de sucesso
    await user.resetLoginAttempts();

    // Atualiza último login
    user.lastLogin = Date.now();
    await user.save();

    // Gera token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.SECRET,
      { expiresIn: '12h' }
    );

    response.status(200).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      valid: true
    });
  } catch (error) {
    if (error.isJoi) {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

exports.userRegister = async (request, response, next) => {
  try {
    const { email, username, password } = request.body;
    
    // Verificar se email já existe
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new AppError('Email já está em uso', 400));
    }

    // Verificar se username já existe
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(new AppError('Nome de usuário já está em uso', 400));
    }

    // Criar novo usuário com role padrão 'user'
    const user = new User({ 
      email, 
      username, 
      password,
      role: 'user' // Role padrão
    });

    await user.save();

    // Gerar token para o novo usuário
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.SECRET,
      { expiresIn: '12h' }
    );

    response.status(201).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      valid: true
    });
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