const logger = require('./logger');

// Middleware para log de requisições
const requestLogger = (request, response, next) => {
  logger.request(request);
  next();
};

// Middleware para endpoint desconhecido
const unknownEndpoint = (request, response) => {
  logger.warn('Endpoint desconhecido', {
    method: request.method,
    path: request.path,
    ip: request.ip
  });
  
  response.status(404).json({ 
    error: 'Endpoint desconhecido',
    message: 'A rota solicitada não existe',
    valid: false
  });
};

// Classe personalizada para erros da aplicação
class AppError extends Error {
  constructor(message, statusCode, name = 'AppError') {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para tratamento de erros
const errorHandler = (error, request, response, next) => {
  logger.errorWithStack(error);

  // Se for um erro operacional (nossos erros personalizados)
  if (error.isOperational) {
    return response.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      valid: false
    });
  }

  // Tratamento de erros conhecidos
  if (error.name === 'CastError') {
    return response.status(400).json({ 
      error: 'ID inválido',
      message: 'O ID fornecido não está no formato correto',
      valid: false
    });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ 
      error: 'Erro de validação',
      message: error.message,
      valid: false
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ 
      error: 'Token inválido',
      message: 'O token fornecido é inválido',
      valid: false
    });
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ 
      error: 'Token expirado',
      message: 'O token fornecido expirou',
      valid: false
    });
  }

  // Erro não tratado
  logger.error('Erro não tratado', error);
  return response.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado',
    valid: false
  });
};

// Middleware para validação de JSON
const validateJSON = (error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ 
      error: 'JSON inválido',
      message: 'O corpo da requisição contém JSON inválido',
      valid: false
    });
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  validateJSON,
  AppError
};
