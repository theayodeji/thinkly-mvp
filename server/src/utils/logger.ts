import winston from 'winston';
import { config } from '../config/env.js';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    config.NODE_ENV === 'production' ? winston.format.json() : combine(colorize(), customFormat)
  ),
  transports: [
    new winston.transports.Console()
  ]
});
