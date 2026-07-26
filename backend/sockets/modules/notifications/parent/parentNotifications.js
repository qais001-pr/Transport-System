const sendPushNotification = require("../../../../common/pushNotification");
const { pool } = require("../../../../utils/dbConnection");

const notifyToDriverForChildLeave = async (
  io,
  parent_id,
  childName,
  leaveDate,
  leaveDays,
) => {
  try {
    const message = `${childName} is on leave ${leaveDate} for ${leaveDays} days`;

    console.log("parent id", { parent_id, childName, leaveDate, leaveDays });

    const driverRes = await pool.query(
      `
       SELECT DISTINCT v.driver_id FROM vans v
       INNER JOIN bookings b ON b.van_id=v.id
       INNER JOIN children c ON c.id=b.child_id
       WHERE c.parent_id=$1 AND b.status='COMPLETED'
        `,
      [parent_id],
    );

    if (!driverRes.rows.length) {
      console.log("No driver found for parent:", parent_id);
      return;
    }

    for (const row of driverRes.rows) {
      const driver_id = row.driver_id;

      console.log("driver id", driver_id);

      await sendPushNotification(driver_id, {
        title: "Child Leave Alert",
        message: message,
        type: "CHILD_LEAVE",
      });

      await pool.query(
        `
      INSERT INTO notifications(user_id, title, message, notification_type)
      VALUES ($1, $2, $3, $4)
      `,
        [driver_id, "Child Leave Alert", message, "CHILD_LEAVE"],
      );

      io.to(`user-${driver_id}`).emit("new-notification", {
        title: "Child Leave Alert",
        message,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  notifyToDriverForChildLeave,
};
