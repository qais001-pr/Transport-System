const { Pool } = require("pg");
require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DB_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?uselibpqcompat=true&sslmode=verify-full`,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Database Connected Successfully");
    client.release();
    return true;
  } catch (err) {
    console.error("Database Connection Failed:", err);
    return false;
  }
};

const disconnectDB = async () => {
  try {
    await pool.end();
    console.log("PostgreSQL Database Disconnected Successfully");
    return true;
  } catch (err) {
    console.error("Database Disconnection Failed:", err.message);
    return false;
  }
};

module.exports = {
  pool,
  connectDB,
  disconnectDB,
};
