const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Middleware para extrair o token do header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

// Middleware para verificar se o usuário está autenticado
const isAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Você não está autenticado. Por favor, faça login para acessar.', 401));
    }

    const decoded = await jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Token inválido ou expirado', 401));
  }
};

// Middleware para verificar se o usuário tem a role necessária
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Você não tem permissão para realizar esta ação', 403));
    }
    next();
  };
};

module.exports = {
  tokenExtractor,
  isAuth,
  restrictTo
}; 