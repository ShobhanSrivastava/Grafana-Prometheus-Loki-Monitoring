const winston = require('winston');
const LokiTransport = require('winston-loki');

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const log = winston.createLogger();

const { NODE_ENV, LOKI_SERVER_ADDRESS, LOKI_USER, LOKI_PASSWORD } = process.env;

const authString = `${LOKI_USER}:${LOKI_PASSWORD}`;

const serviceName = NODE_ENV === 'production' ? 'shobhan.openinapp.com' : 'shobhan.inopenapp.com';

const localLoggingFormat = printf(({ timestamp, level, message, stack }) => {
    // Printing the complete error stack in case of errors
    if(stack) return `${timestamp} [${level}]: ${stack}`; 

    return `${timestamp} [${level}]: ${message}`; 
});

if(NODE_ENV === 'production' || NODE_ENV === 'staging') {
    log.add(new LokiTransport({
        format: combine(
            errors({ stack: true }),
            json(),
            // localLoggingFormat
        ),
        host: LOKI_SERVER_ADDRESS,
        basicAuth: authString,
        labels: { service_name: serviceName },
        json: true,
        level: 'debug'
    }));
} else {
    log.add(new winston.transports.Console({
        format: combine(
            errors({ stack: true }),
            json(), 
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            colorize(),
            localLoggingFormat
        ),
        level: 'debug'
    }))
}

module.exports = log;