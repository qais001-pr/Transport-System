const sendPushNotification = require("../../../../common/pushNotification");
const { pool } = require("../../../../utils/dbConnection");
const getDistanceInMeters = require("../../../getDistance");

const childPickupNotification = async (socket, io, childId) => {
  try {
    const userId = socket.user.id;

    const childResult = await pool.query(
      `SELECT latitude, longitude, parent_id 
       FROM children 
       WHERE id = $1`,
      [childId],
    );

    if (!childResult.rows.length) return;

    const { latitude: cLat, longitude: cLng, parent_id } = childResult.rows[0];

    const vanResult = await pool.query(
      `
      SELECT vt.latitude, vt.longitude
      FROM vans v
      LEFT JOIN LATERAL (
        SELECT latitude, longitude
        FROM van_tracking
        WHERE van_id = v.id
        ORDER BY recorded_at DESC
        LIMIT 1
      ) vt ON true
      WHERE v.driver_id = $1
      LIMIT 1
      `,
      [userId],
    );

    if (!vanResult.rows.length || !vanResult.rows[0].latitude) return;

    const { latitude: vLat, longitude: vLng } = vanResult.rows[0];

    const distance = getDistanceInMeters(cLat, cLng, vLat, vLng);
    if (distance <= 100) {
      const message = "Van is nearby. Please be ready for pickup.";

      // io.to(`user-${parent_id}`).emit("new-notification", {
      //   childId,
      //   message,
      //   distance,
      // });

      await pool.query(
        `
        INSERT INTO notifications(user_id, title, message, notification_type)
        VALUES ($1, $2, $3, $4)
        `,
        [parent_id, "Pickup Alert", message, "PICK_UP"],
      );

      await sendPushNotification(userId, {
        title: "Pickup Alert",
        message: message,
        type: "CHILD_PICKUP",
      });

      io.to(`user-${parent_id}`).emit("new-notification", {
        title: "Pickup Alert",
        message,
      });
    }
  } catch (error) {
    console.error("pickup error:", error);
  }
};

const childPickedUpNotification = async (
  socket,
  io,
  childId,
  vanId,
  pickup_time,
  latitude,
  longitude,
) => {
  try {
    const userId = socket.user.id;

    await pool.query("BEGIN");

    await pool.query(
      `
      INSERT INTO child_pickups
      (child_id, van_id, driver_id, pickup_time, latitude, longitude, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'PICKED_UP')
      `,
      [childId, vanId, userId, pickup_time, latitude, longitude],
    );

    const parentRes = await pool.query(
      `SELECT parent_id FROM children WHERE id = $1`,
      [childId],
    );

    const parentId = parentRes.rows[0].parent_id;

    const message = "Your child has been picked up successfully.";

    await pool.query(
      `
      INSERT INTO notifications(user_id, title, message, notification_type)
      VALUES ($1, $2, $3, $4)
      `,
      [parentId, "Your child have picked up", message, "PICK_UP"],
    );

    await pool.query("COMMIT");

    // io.to(`user-${parentId}`).emit("new-notification", {
    //   childId,
    //   message,
    //   pickup_time,
    // });

    await sendPushNotification(userId, {
      title: "Your child have picked up",
      message: message,
      type: "CHILD_PICKEDUP",
    });

    io.to(`user-${parentId}`).emit("new-notification", {
      title: "Your child have picked up",
      message,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("pickup commit error:", error);
  }
};

module.exports = {
  childPickupNotification,
  childPickedUpNotification,
};
