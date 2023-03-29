import winston, { createLogger, format, transports } from 'winston';
import { sub } from 'date-fns';

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(
  ({ level, message, timestamp }) => `${sub(new Date(timestamp), { hours: 3 }).toISOString()} ${level}: ${message}`,
);

/* const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '5d',
  maxSize: '5m',
}); */

const logger = createLogger({
  format: combine(timestamp(), customFormat),
  /* transports: [
    // fileRotateTransport,
    new transports.Console({ format: combine(timestamp(), colorize(), customFormat) }),
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error', maxsize: 5000000, maxFiles: 3 }),
    new winston.transports.File({ filename: 'logs/warnings.log', level: 'warn', maxsize: 5000000, maxFiles: 3 }),
  ], */
});

export default logger;
