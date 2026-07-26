const sendPushNotification = require("../../../../common/pushNotification");
const { pool } = require("../../../../utils/dbConnection");

const createNewDelay = async (
  socket,
  io,
  {
    vanId,
    routeId,
    reason,
    comments,
    delayMinutes,
    location,
    incidentDate,
    studentsAffected,
  },
) => {
  try {
    const driverId = socket.user.id;

    if (!vanId || !reason || !delayMinutes) {
      return socket.emit("error", "Missing required fields");
    }

    await pool.query("BEGIN");

    const delayResult = await pool.query(
      `
      INSERT INTO delay_reports (
        van_id, route_id, driver_id, status,
        reason, comments, delay_minutes,
        location, incident_date, students_affected, reported_at
      )
      VALUES ($1,$2,$3,'PENDING',$4,$5,$6,$7,$8,$9,NOW())
      RETURNING *
      `,
      [
        vanId,
        routeId,
        driverId,
        reason,
        comments,
        delayMinutes,
        location,
        incidentDate,
        studentsAffected,
      ],
    );

    const delay = delayResult.rows[0];

    const usersResult = await pool.query(
      `
      SELECT DISTINCT ON (u.id)
  c.id,
  u.id AS user_id,

  COALESCE(cp.status, 'NOT_PICKED') AS pickup_status

FROM bookings b
JOIN children c ON c.id = b.child_id
JOIN users u ON u.id = c.parent_id

-- latest pickup per child
LEFT JOIN LATERAL (
  SELECT status
  FROM child_pickups
  WHERE child_id = c.id AND van_id = $1
  ORDER BY pickup_time DESC
  LIMIT 1
) cp ON true

WHERE b.van_id = $1
      `,
      [vanId],
    );

    const users = usersResult.rows;

    const notifications = [];
    const notifiedUsers = new Set();

    for (const user of users) {
      if (notifiedUsers.has(user.user_id)) continue;
      notifiedUsers.add(user.user_id);

      let title = "Van Delay";
      let message = `Van is delayed by ${delayMinutes} minutes`;

      if (reason.toLowerCase() === "accident") {
        if (user.pickup_status === "PICKED_UP") {
          title = "Emergency Alert";
          message = "Van has met with an accident. Please stay calm.";
        } else {
          title = "Route Cancelled";
          message = "Van will not arrive due to an accident.";
        }
      }

      const notificationResult = await pool.query(
        `
    INSERT INTO notifications (
      user_id,
      title,
      message,
      notification_type,
      created_at
    )
    VALUES ($1,$2,$3,$4,NOW())
    RETURNING *
    `,
        [user.user_id, title, message, "DELAY"],
      );

      notifications.push(notificationResult.rows[0]);

      console.log("user id", user.user_id);

      await sendPushNotification(user.user_id, {
        title: title,
        message: message,
        type: "DELAY",
      });

      io.to(`user-${user.user_id}`).emit("new-notification", {
        title,
        message,
        delay,
      });
    }

    await pool.query("COMMIT");

    // users.forEach((user) => {
    //   io.to(`user-${user.user_id}`).emit("new-notification", {
    //     title: "Van Delay Alert",
    //     message: `Van is delayed by ${delayMinutes} minutes`,
    //     delay,
    //   });
    // });

    socket.emit("new-delay", delay);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error(error);
    socket.emit("error", "Failed to create delay");
  }
};

const delaysHistoryForDriver = async (socket) => {
  try {
    const driverId = socket.user.id;
    const result = await pool.query(
      `
        SELECT * FROM delay_reports WHERE driver_id = $1
        `,
      [driverId],
    );
    socket.emit("delays-history", result.rows);
  } catch (error) {
    console.error(error);
    socket.emit("error", "An error occurred while processing delays");
  }
};

module.exports = {
  createNewDelay,
  delaysHistoryForDriver,
};
