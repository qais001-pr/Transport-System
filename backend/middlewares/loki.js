// import pino from "pino";
// import LokiTransport from "pino-loki";


// const transport = LokiTransport({
//     host: `${process.env.LOKI_URL}`,
//     labels: {
//         app: `${process.env.LOKI_APP_NAME}`,
//         env: `${process.env.LOKI_ENV}`
//     }
// });


// const logger = pino(
//     {
//         level: "info"
//     },
//     transport
// );


// export default logger;