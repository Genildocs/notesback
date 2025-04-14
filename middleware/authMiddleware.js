const { isAuth } = require('../controllers/authController');

// Middleware para extrair o token do header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

// Middleware para validar usuário usando a função isAuth do authController
const userExtractor = isAuth;

module.exports = {
  tokenExtractor,
  userExtractor
}; 