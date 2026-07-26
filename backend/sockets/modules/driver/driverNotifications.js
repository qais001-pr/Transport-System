const sendPushNotification = require("../../../common/pushNotification");
const { pool } = require("../../../utils/dbConnection");

const notifyToParentForDriverLeave = async (
  io,
  driverId,
  driverName,
  leaveDate,
  leaveDays,
) => {
  try {
    const message = `${driverName} is on leave ${leaveDate} for ${leaveDays} days`;

    const childRes = await pool.query(
      `
       SELECT DISTINCT c.parent_id FROM children c
       INNER JOIN bookings b ON b.child_id=c.id
       INNER JOIN vans v ON v.id=b.van_id
       WHERE v.driver_id=$1 AND b.status='COMPLETED'
        `,
      [driverId],
    );

    if (!childRes.rows.length) {
      console.log("No parents found for driver:", driverId);
      return;
    }

    for (const row of childRes.rows) {
      const parent_id = row.parent_id;

      await sendPushNotification(parent_id, {
        title: "Driver Leave Alert",
        message: message,
        type: "DRIVER_LEAVE",
      });

      await pool.query(
        `
        INSERT INTO notifications(user_id, title, message, notification_type)
        VALUES ($1, $2, $3, $4)
        `,
        [parent_id, "Driver Leave Alert", message, "DRIVER_LEAVE"],
      );

      io.to(`user-${parent_id}`).emit("new-notification", {
        title: "Driver Leave Alert",
        message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const notifyToParentForDriverRestoring = async (io, driverId, driverName) => {
  try {
    const message = `${driverName} is back on their duty`;

    const childRes = await pool.query(
      `
       SELECT DISTINCT c.parent_id FROM children c
       INNER JOIN bookings b ON b.child_id=c.id
       INNER JOIN vans v ON v.id=b.van_id
       WHERE v.driver_id=$1 AND b.status='COMPLETED'
        `,
      [driverId],
    );

    if (!childRes.rows.length) {
      console.log("No parents found for driver:", driverId);
      return;
    }

    for (const row of childRes.rows) {
      const parent_id = row.parent_id;

      await sendPushNotification(parent_id, {
        title: "Driver is Back",
        message: message,
        type: "DRIVER_BACK",
      });

      const insertResult = await pool.query(
        `
        INSERT INTO notifications(user_id, title, message, notification_type)
        VALUES ($1, $2, $3, $4)
        `,
        [parent_id, "Driver Back Alert", message, "DRIVER_BACK"],
      );

      io.to(`user-${parent_id}`).emit("new-notification", {
        id: insertResult.rows[0].id,
        title: "Driver is Back",
        message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  notifyToParentForDriverLeave,
  notifyToParentForDriverRestoring,
};
