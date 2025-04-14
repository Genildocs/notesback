const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const todoRoute = require('./routes/todoRoutes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const security = require('./middleware/securityMiddleware');

// Configuração do MongoDB
mongoose.set('strictQuery', false);

logger.info('Conectando ao MongoDB:', config.MONGO_URL);

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info('Conectado ao MongoDB com sucesso');
  })
  .catch((error) => {
    logger.error('Erro ao conectar ao MongoDB:', error.message);
  });

// Middlewares globais
const app = express();

// Segurança
app.use(security.helmetConfig);
app.use(security.xss());
app.use(security.mongoSanitize());
app.use(security.hpp());
app.use(security.sanitizeInput);
app.use(security.validatePayload);

// Rate limiting para rotas de autenticação
app.use('/api/auth', security.limiter);

// Outros middlewares
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// Middlewares de logging e validação
app.use(middleware.validateJSON);
app.use(middleware.requestLogger);

// Rotas da API
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/todos', todoRoute);

// Middleware de tratamento de erros
app.use(errorHandler);

// Middlewares de erro
app.use(middleware.unknownEndpoint);

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
