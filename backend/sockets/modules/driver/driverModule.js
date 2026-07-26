const { pool } = require("../../../utils/dbConnection");
const getDistanceInMeters = require("../../getDistance");
const { createNewDelay, delaysHistoryForDriver } = require("./delays/delays");
const {
  notifyToParentForDriverLeave,
  notifyToParentForDriverRestoring,
} = require("./driverNotifications");

const driverModule = async (socket, io) => {
  console.log("Driver module initialized for socket:", socket.id);
  const socketDriverMap = {};
  const TIME_THRESHOLD = 15000;
  const DISTANCE_THRESHOLD = 20;

  // =========================
  // DRIVER JOIN
  // =========================
  socket.on("join-driver", async () => {
    try {
      if (!socket.user || socket.user.role !== "DRIVER") {
        return socket.emit("error", "Access denied");
      }

      const driverId = socket.user.id;
      socket.join(`driver-${driverId}`);

      socketDriverMap[socket.id] = driverId;

      const result = await pool.query(
        "SELECT id FROM vans WHERE driver_id = $1",
        [driverId],
      );

      if (result.rows.length === 0) return;

      console.log("ALL VAN ROWS:", result.rows);

      for (const row of result.rows) {
        console.log("JOINING ROOM:", `van-${row.id}`);
        socket.join(`van-${row.id}`);
      }
    } catch (err) {
      console.error("join-driver error:", err.message);
    }
  });

  // =========================
  // DRIVER SEND LOCATION
  // =========================
  socket.on("send-location", async ({ lat, lng, speed }) => {
    try {
      if (!socket.user || socket.user.role !== "DRIVER") return;

      const driverId = socket.user.id;

      const vanRes = await pool.query(
        "SELECT id FROM vans WHERE driver_id = $1",
        [driverId],
      );

      if (vanRes.rows.length === 0) return;

      const vanId = vanRes.rows[0].id;
      // console.log("2 driver van id", vanId);

      // get last location
      const lastRes = await pool.query(
        `SELECT latitude, longitude, recorded_at 
           FROM van_tracking 
           WHERE van_id = $1 
           ORDER BY recorded_at DESC 
           LIMIT 1`,
        [vanId],
      );

      let shouldSave = true;

      if (lastRes.rows.length > 0) {
        const last = lastRes.rows[0];

        const distance = getDistanceInMeters(
          last.latitude,
          last.longitude,
          lat,
          lng,
        );

        const timeDiff = Date.now() - new Date(last.recorded_at).getTime();

        if (distance < DISTANCE_THRESHOLD && timeDiff < TIME_THRESHOLD) {
          shouldSave = false;
        }
      }

      if (!shouldSave) return;

      // Save history
      await pool.query(
        `INSERT INTO van_tracking (van_id, latitude, longitude, recorded_at)
           VALUES ($1, $2, $3, NOW())`,
        [vanId, lat, lng],
      );

      // Emit live
      io.to(`van-${vanId}`).emit("receive-location", {
        lat,
        lng,
        speed,
      });
    } catch (err) {
      console.error("send-location error:", err.message);
    }
  });

  // =========================
  // ALL STUDENTS IN VAN
  // =========================
  // FIRST: handle joining
  socket.on("join-van", async () => {
    try {
      if (!socket.user || socket.user.role !== "DRIVER") return;

      const vanRes = await pool.query(
        "SELECT id FROM vans WHERE driver_id = $1",
        [socket.user.id],
      );

      if (vanRes.rows.length === 0) return;

      const vanId = vanRes.rows[0].id;

      socket.join(`van-${vanId}`);
      console.log("Driver joined room:", `van-${vanId}`);
    } catch (err) {
      console.error("join-van error:", err.message);
    }
  });

  socket.on("all-students-in-van", async () => {
    try {
      if (!socket.user || socket.user.role !== "DRIVER") return;

      const vanRes = await pool.query(
        "SELECT id FROM vans WHERE driver_id = $1",
        [socket.user.id],
      );

      if (vanRes.rows.length === 0) return;

      const vanId = vanRes.rows.map((v) => v.id);
      // console.log("student van id", vanId);

      const students = await pool.query(
        `SELECT DISTINCT ON (c.id)
  c.id,
  c.full_name,
  c.pickup_address,
  c.latitude,
  c.longitude,
  c.branch_id,
  c.child_pic,

  cp.status,
  cp.pickup_time,

  rs.sequence_no AS current_stop,

  p.full_name AS parent_name,
  p.phone AS parent_phone,

  b.van_id,
  r.id AS route_id,

  sb.latitude AS school_lat,
  sb.longitude AS school_lng,
  sb.address AS school_address,

  COUNT(*) OVER() AS total_students

FROM children c

JOIN users p 
  ON p.id = c.parent_id

JOIN bookings b 
  ON b.child_id = c.id 
  AND b.status = 'COMPLETED'

JOIN routes r 
  ON r.van_id = b.van_id

JOIN route_stops rs 
  ON rs.route_id = r.id 

LEFT JOIN school_branches sb 
  ON sb.id = c.branch_id

LEFT JOIN LATERAL (
  SELECT status, pickup_time
  FROM child_pickups
  WHERE child_id = c.id
  ORDER BY pickup_time DESC
  LIMIT 1
) cp ON true

WHERE b.van_id = ANY($1) AND NOT EXISTS(
SELECT 1 FROM child_leaves cl WHERE cl.child_id = c.id AND cl.is_active = true
)

ORDER BY c.id, rs.sequence_no ASC`,
        [vanId],
      );

      const schoolRes = await pool.query(
        `SELECT latitude, longitude, branch_name AS name
FROM school_branches
WHERE id = $1`,
        [students.rows[0].branch_id],
      );

      // console.log(students.rows);

      socket.emit("all-students-in-van", {
        students: students.rows,
        school: schoolRes.rows[0],
      });
      // OR if you want room-based:
      // io.to(`van-${vanId}`).emit("all-students-in-van", students.rows);
    } catch (err) {
      console.error("all-students-in-van error:", err.message);
    }
  });

  // =========================
  // DELAY REPORTING
  // =========================
  // socket.on("driver-join-delays", async () => {
  //   try {
  //     if (!socket.user || socket.user.role !== "DRIVER") return;
  //     socket.join(`driver-${socket.user.id}`);
  //   } catch (err) {
  //     console.error("driver-join-delays error:", err.message);
  //   }
  // });

  socket.on("new-delay", async (data) => {
    try {
      if (!socket.user || socket.user.role !== "DRIVER") return;

      await createNewDelay(socket, io, data);
    } catch (err) {
      console.error("report-delay error:", err.message);
    }
  });

  socket.on("delays-history", async () => {
    try {
      if (!socket.user || socket.user.role !== "DRIVER") return;

      await delaysHistoryForDriver(socket);
    } catch (err) {
      console.error("delays-history error:", err.message);
    }
  });

  // notify on child leave
  socket.on("driver-on-leave", async (data) => {
    await notifyToParentForDriverLeave(
      io,
      socket.user.id,
      data.driverName,
      data.leaveDate,
      data.leaveDays,
    );
  });
  socket.on("driver-restore", async (data) => {
    await notifyToParentForDriverRestoring(io, socket.user.id, data.driverName);
  });

  // =========================
  // DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    delete socketDriverMap[socket.id];
    console.log("Disconnected:", socket.id);
  });
};

module.exports = driverModule;
