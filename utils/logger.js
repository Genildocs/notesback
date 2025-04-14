const winston = require('winston');
const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

// Formato personalizado para os logs
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Configuração do logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Logs de erro em arquivo separado
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Todos os logs em arquivo principal
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Logs no console com cores
    new transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    })
  ]
});

// Funções auxiliares para diferentes níveis de log
const log = {
  error: (message, meta) => logger.error(message, meta),
  warn: (message, meta) => logger.warn(message, meta),
  info: (message, meta) => logger.info(message, meta),
  debug: (message, meta) => logger.debug(message, meta),
  http: (message, meta) => logger.http(message, meta),
  
  // Log de requisições HTTP
  request: (req) => {
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  },
  
  // Log de erros com stack trace
  errorWithStack: (error) => {
    logger.error(error.message, {
      stack: error.stack,
      name: error.name
    });
  }
};

module.exports = log;
