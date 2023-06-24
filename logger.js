const winston = require('winston');
const { createLogger, format } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message,ipAddress, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message} from ip -> ${ipAddress}`;
});

const logger = createLogger({
    format: combine(
        label({ label: 'right meow!' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
});

module.exports = logger;