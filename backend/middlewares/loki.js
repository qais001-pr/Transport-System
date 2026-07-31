const pino = require('pino');

const transport = pino.transport({
    target: 'pino-loki',
    options: {
        host: `${process.env.LOKI_URL}`,
        labels: {
            app: 'school-transport-backend',
            environment: 'development'
        },
        interval: 5
    }
});

const logger = pino(transport);

module.exports = logger;