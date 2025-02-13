const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGO_URL);

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/users', authRoute);
app.use('/api/users', userRoute);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
