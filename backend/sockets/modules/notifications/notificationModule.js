const { pool } = require("../../../utils/dbConnection");
const {
  childPickupNotification,
  childPickedUpNotification,
} = require("./driver/childPickup");
const { sendGuardNotification } = require("./guard/guardNotification");
const { notifyToDriverForChildLeave } = require("./parent/parentNotifications");

const notificationModule = async (socket, io) => {
  console.log("Notification module initialized for socket:", socket.id);

  socket.on("join-user", () => {
    const userId = socket.user.id;

    socket.join(`user-${userId}`);

    console.log(`User joined room: user-${userId}`);
  });

  // Get notification history
  socket.on("notification-history", async ({ page = 1, limit = 10 } = {}) => {
    try {
      const userId = socket.user.id;

      const offset = (page - 1) * limit;

      const result = await pool.query(
        `
        SELECT id, title, message, notification_type,is_read, created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [userId, limit, offset],
      );

      socket.emit("notification-history", {
        data: result.rows,
        page,
        limit,
      });
    } catch (error) {
      console.error("notification-history error:", error);
      socket.emit("error", "Failed to fetch notifications");
    }
  });

  socket.on("mark-as-read", async () => {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1`,
      [socket.user.id],
    );
  });

  socket.on("remove-notification", async ({ id }) => {
    try {
      await pool.query(
        `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
        [id, socket.user.id],
      );

      socket.emit("notification-removed", { id });
    } catch (err) {
      socket.emit("error", "Failed to remove notification");
    }
  });

  // parent notifications
  // when near to home
  socket.on("pickup-notification", async (data) => {
    await childPickupNotification(socket, data.childId);
  });

  // after picked up
  socket.on("picked-up-notification", async (data) => {
    await childPickedUpNotification(
      socket,
      data.childId,
      data.vanId,
      data.pickup_time,
      data.latitude,
      data.longitude,
    );
  });

  // notify on child leave
  socket.on("child-on-leave", async (data) => {
    await notifyToDriverForChildLeave(
      io,
      socket.user.id,
      data.childName,
      data.leaveDate,
      data.leaveDays,
    );
  });

  // =========================
  // GUSRD DASHBOARD
  // =========================
  socket.on("new-notification", async ({ status }) => {
    await sendGuardNotification(socket, socket.user.id, status);
  });
};

module.exports = notificationModule;
