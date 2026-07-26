const sendPushNotification = require("../../../../common/pushNotification");
const { pool } = require("../../../../utils/dbConnection");

const sendGuardNotification = async (socket, guardId, status) => {
  try {
    const notifications = [];
    const presentTitle = "Your child arrived at school";
    const presentMessage = "Your child has arrived at school.";
    const absentTitle = "Your child is absent today";
    const absentMessage = "Your child is marked as absent for today.";
    const title = status === "VERIFIED" ? presentTitle : absentTitle;
    const message = status === "VERIFIED" ? presentMessage : absentMessage;

    const usersResult = await pool.query(
      `
      SELECT DISTINCT p.id
      FROM users p
      JOIN children c ON c.parent_id = p.id
      JOIN bookings b ON b.child_id = c.id AND b.status='COMPLETED'
      JOIN vans v ON v.id = b.van_id
      JOIN school_guards sg ON sg.branch_id = c.branch_id
      WHERE sg.guard_id = $1
      `,
      [guardId],
    );

    for (const user of usersResult.rows) {
      notifications.push({ userId: user.id, title, message });
    }

    // Send notifications to all relevant users
    for (const notification of notifications) {
      await pool.query(
        `
          INSERT INTO notifications (user_id, title, message, notification_type)
          VALUES ($1, $2, $3, $4)
          `,
        [
          notification.userId,
          notification.title,
          notification.message,
          "CHILD ARRIVAL",
        ],
      );

      await sendPushNotification(notification.userId, {
        title: "CHILD ARRIVAL",
        message: message,
        type: "CHILD ARRIVAL",
      });
      socket.to(`user_${notification.userId}`).emit("new-notification", {
        title: notification.title,
        message: notification.message,
      });
    }
  } catch (error) {
    console.error("Error sending guard notification:", error);
  }
};

module.exports = {
  sendGuardNotification,
};
