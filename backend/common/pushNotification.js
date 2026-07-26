const webPush = require("web-push");
const { pool } = require("../utils/dbConnection");

webPush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

const sendPushNotification = async (userId, payload) => {
  try {
    const result = await pool.query(
      `
      SELECT endpoint, p256dh, auth
      FROM push_subscriptions
      WHERE user_id = $1 AND is_active = true
      `,
      [userId],
    );

    for (const row of result.rows) {
      try {
        const subscription = {
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth,
          },
        };

        await webPush.sendNotification(subscription, JSON.stringify(payload));
      } catch (error) {
        console.error("Push error:", error.statusCode);

        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log("Deleting expired subscription:", row.id);

          await pool.query("DELETE FROM push_subscriptions WHERE id = $1", [
            row.id,
          ]);
        }
      }
    }
  } catch (error) {
    console.error("Push error:", error);

    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log("Deleting expired subscription:", row.id);

      await pool.query("DELETE FROM push_subscriptions WHERE id = $1", [
        row.id,
      ]);
    }
  }
};

module.exports = sendPushNotification;
