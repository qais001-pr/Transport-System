require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, disconnectDB, pool } = require("./utils/dbConnection");
const { swaggerUi, swaggerSpec } = require("./swagger/swagger.config");
const body_parser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
const { authLimiter, apiLimiter } = require("./middlewares/rateLimiter");
const http = require("http");
const { Server } = require("socket.io");
const { autoResetLeaves } = require("./controllers/parents/parentController");
const setupSocket = require("./sockets/setupSocket");
const cron = require("node-cron");
const client = require('prom-client'); // Official Prometheus client
const app = express();
const port = process.env.PORT || 7860;
const { Counter } = require('prom-client');
const server = http.createServer(app);
// Create a Registry
const register = new client.Registry();
// Collect default Node.js metrics
client.collectDefaultMetrics({ register });

// Create HTTP request counter
const httpRequests = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
});
// Register the metric
register.registerMetric(httpRequests);

httpRequests.inc();
// Count every request
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequests.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });

  next();
});
// Metrics endpoint
if (process.env.NODE_ENV !== "production") {
  app.get("/api/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
}

// Create a Loki Logger Object 
const logger = require('./middlewares/loki')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const allowedOrigins = [
  "*",
  "http://localhost:3000",
  "https://schooltransportsystem.netlify.app",
];


app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use("/uploads", (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath, stat) => {
      const origin = res.req && res.req.headers && res.req.headers.origin;
      if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Vary", "Origin");
      }
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);
app.use("/uploads", express.static(path.resolve("uploads")));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
if (process.env.NODE_ENV !== "production") {
  app.get("/swagger.json", (req, res) => res.json(swaggerSpec));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use("/api/auth", require("./routes/auth/authRoute"));
app.use("/api/users", require("./routes/users/userRoutes"));
app.use("/api/parents", require("./routes/parents/parentRoute"));
app.use("/api/payments", require("./routes/payments/paymentRoutes"));
app.use("/api/bookings", require("./routes/bookings/bookingRoutes"));
app.use("/api/vans", require("./routes/vans/vanRoutes"));
app.use("/api/guards", require("./routes/guards/guardRoutes"));
app.use("/api/drivers", require("./routes/drivers/driverRoutes"));
app.use("/api/admin", require("./routes/admin/adminRoutes"));
app.use("/api/schools", require("./routes/schools/schoolRoutes"));
app.use("/api/police", require("./routes/police/policeRoutes"));

app.get("/", (req, res) => {
  logger.info('Hello Message From Loki!.The Current Server Status is Running!');
  res.send("Welcome to the FYP Backend API");
});

//socket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);

//push notifications
app.post("/subscribe", async (req, res) => {
  try {
    const { subscription, userId } = req.body;
    console.log("subscription........", subscription, userId);

    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys.p256dh;
    const auth = subscription.keys.auth;

    await pool.query(
      `
      INSERT INTO push_subscriptions (
        user_id,
        endpoint,
        p256dh,
        auth,
        is_active,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,true,NOW(),NOW())
      ON CONFLICT (endpoint)
      DO UPDATE SET
      user_id = EXCLUDED.user_id,
      p256dh = EXCLUDED.p256dh,
      auth = EXCLUDED.auth,
      is_active = true,
      updated_at = NOW()
      `,
      [userId, endpoint, p256dh, auth],
    );

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    if (err.statusCode === 410) {
      await pool.query(
        `UPDATE push_subscriptions SET is_active = false WHERE endpoint = $1`,
        [subscription.endpoint],
      );
    }
    res.status(500).json({ error: "Subscription failed" });
  }
});

//middlewares for error handling
app.use(require("./middlewares/errorsHandling").routeNotFoundMiddleware);
app.use(require("./middlewares/errorsHandling").errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    cron.schedule("0 0 * * *", async () => {
      console.log("Running leave reset job...");
      await autoResetLeaves();
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    // if(!process.env.VERCEL){
    //   await app.listen(port);
    //   console.log(`Server is running on port ${port} vercel`);
    // }else{
    //   await app.init();
    //   console.log(`Server is running on port ${port} init`);
    // }
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await disconnectDB();
  process.exit(0);
});

startServer();
module.exports = app;

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   }),
// );
