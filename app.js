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
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// Middlewares de logging e validação
app.use(middleware.validateJSON);
app.use(middleware.requestLogger);

// Rotas da API
app.use('/api/v1', authRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', todoRoute);

// Middleware de tratamento de erros
app.use(errorHandler);

// Middlewares de erro
app.use(middleware.unknownEndpoint);

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Promessa rejeitada não tratada:', error);
  process.exit(1);
});

module.exports = app;
