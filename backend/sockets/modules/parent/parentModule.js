const { pool } = require("../../../utils/dbConnection");
const { childOnRouteDetails, driverInformationForParent } = require("./child");

const parentModule = async (socket, io) => {
  console.log("Parent module initialized for socket:", socket.id);

  socket.on("child-on-route-details", async () => {
    await childOnRouteDetails(socket);
  });

  socket.on("driver-information-for-parent", async () => {
    await driverInformationForParent(socket);
  });

  // =========================
  // PARENT JOIN
  // =========================
  socket.on("join-parent", async (vanId) => {
    try {
      if (!socket.user || socket.user.role !== "PARENT") {
        return socket.emit("error", "Access denied");
      }

      if (!vanId) {
        return socket.emit("error", "Van ID missing");
      }

      console.log("Parent joining van:", vanId);

      socket.join(`van-${vanId}`);

      const result = await pool.query(
        `SELECT latitude, longitude, recorded_at 
       FROM van_tracking 
       WHERE van_id = $1 
       ORDER BY recorded_at DESC 
       LIMIT 1`,
        [vanId],
      );

      if (result.rows.length > 0) {
        const loc = result.rows[0];

        socket.emit("receive-location", {
          lat: loc.latitude,
          lng: loc.longitude,
          time: loc.recorded_at,
        });
      }
    } catch (err) {
      console.error("join-parent error:", err.message);
    }
  });
};

module.exports = parentModule;
