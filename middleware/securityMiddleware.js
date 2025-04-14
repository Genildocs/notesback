const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// Configuração do rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, por favor tente novamente mais tarde'
});

// Configuração do helmet
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "*"],
      scriptSrc: ["'self'", "*"],
      styleSrc: ["'self'", "*"],
      imgSrc: ["'self'", "*"],
      connectSrc: ["'self'", "*"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true
});

// Middleware para sanitização de inputs
const sanitizeInput = (req, res, next) => {
  // Sanitiza o body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitiza os parâmetros da URL
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].trim();
      }
    });
  }

  // Sanitiza os query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};

// Middleware para validação de payload
const validatePayload = (req, res, next) => {
  const maxPayloadSize = 1024 * 1024; // 1MB
  if (req.headers['content-length'] > maxPayloadSize) {
    return res.status(413).json({
      error: 'Payload muito grande',
      message: 'O tamanho máximo permitido é 1MB'
    });
  }
  next();
};

module.exports = {
  limiter,
  helmetConfig,
  sanitizeInput,
  validatePayload,
  xss,
  mongoSanitize,
  hpp
}; 