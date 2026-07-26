const { pool } = require("../../../utils/dbConnection");
const getDistanceInMeters = require("../../getDistance");
const { delayHistoryForGuard } = require("./delays/delays");

const getLatLongBySchool = async (guardId) => {
  const result = await pool.query(
    `SELECT sb.latitude, sb.longitude, sb.branch_name FROM school_branches sb 
    JOIN schools s ON s.id = sb.school_id
    LEFT JOIN school_guards sg ON sg.branch_id = sb.id
    WHERE sg.guard_id = $1`,
    [guardId],
  );

  if (result.rows.length === 0) {
    return {
      lat: null,
      lng: null,
      branch_name: null,
    };
  }
  return {
    lat: result.rows[0].latitude ?? null,
    lng: result.rows[0].longitude ?? null,
    branch_name: result.rows[0].branch_name ?? null,
  };
};

const guardModule = async (socket, io) => {
  console.log("Guard module initialized for socket:", socket.id);

  // GET ALL VAN STATUS
  socket.on("get-vans-status", async () => {
    try {
      const result = await pool.query(
        `
          SELECT DISTINCT ON (v.id)
  v.id AS van_id,
  v.number_plate,
  v.capacity,

  u.full_name AS driver_name,
  u.phone,
  u.profile_photo,

  vt.latitude,
  vt.longitude,
  vt.recorded_at,

  COUNT(DISTINCT c.id) AS total_students,
  c.id AS child_id,
  c.full_name AS child_name,
  c.child_pic,

  sb.id AS school_id,
  sb.branch_name


FROM vans v
JOIN users u ON u.id = v.driver_id
LEFT JOIN LATERAL (
  SELECT latitude, longitude, recorded_at
  FROM van_tracking
  WHERE van_id = v.id
  ORDER BY recorded_at DESC
  LIMIT 1
) vt ON true
LEFT JOIN bookings b ON b.van_id = v.id
LEFT JOIN children c ON c.id = b.child_id
LEFT JOIN school_guards sg ON sg.branch_id = c.branch_id
LEFT JOIN school_branches sb ON sb.id = c.branch_id
WHERE sg.guard_id = $1 AND NOT EXISTS (
  SELECT 1 FROM child_leaves cl WHERE cl.child_id = c.id AND cl.is_active = true
)
GROUP BY 
  v.id,
  v.number_plate,
  v.capacity,
  u.full_name,
  u.phone,
  vt.latitude,
  vt.longitude,
  vt.recorded_at,
  u.profile_photo,
  c.full_name,
  c.child_pic,
  c.id,
  sb.id,
  sb.branch_name

ORDER BY v.id, vt.recorded_at DESC;
        `,
        [socket.user.id],
      );

      const SCHOOL = await getLatLongBySchool(socket.user.id);

      const vans = result.rows.map((van) => {
        let status = "on-route";
        let distance = null;

        if (van.latitude && van.longitude) {
          distance = getDistanceInMeters(
            van.latitude,
            van.longitude,
            SCHOOL.lat,
            SCHOOL.lng,
          );

          if (distance < 50) {
            status = "arrived";
          } else if (distance < 500) {
            status = "approaching";
          }
        }

        return {
          vanId: van.van_id,
          vanNumber: van.number_plate,
          driver: van.driver_name,
          phone: van.phone,
          driver_profile_photo: van.profile_photo,
          students: `${van.total_students}/${van.capacity}`,
          school_id: van.school_id,
          child_data: {
            child_pics: van.child_pic ? [van.child_pic] : null,
            child_names: van.child_name ? [van.child_name] : null,
            child_ids: van.child_id ? [van.child_id] : null,
          },
          lat: van.latitude,
          lng: van.longitude,
          lastUpdate: van.recorded_at,
          status,
          distance,
          branch_name: SCHOOL.branch_name,
          schoolLat: SCHOOL.lat,
          schoolLng: SCHOOL.lng,
        };
      });

      socket.emit("vans-status", vans);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to fetch vans");
    }
  });

  // AUTO REFRESH EVERY 10s (REALTIME DASHBOARD)
  const interval = setInterval(async () => {
    try {
      const result = await pool.query(
        `
          SELECT DISTINCT ON (v.id)
  v.id AS van_id,
  v.number_plate,
  v.capacity,

  u.full_name AS driver_name,
  u.phone,
  u.profile_photo,

  vt.latitude,
  vt.longitude,
  vt.recorded_at,

  COUNT(DISTINCT c.id) AS total_students,
  c.id AS child_id,
  c.full_name AS child_name,
  c.child_pic,

  sb.id AS school_id,
  sb.branch_name

FROM vans v
JOIN users u ON u.id = v.driver_id

-- ONLY LATEST LOCATION
LEFT JOIN LATERAL (
  SELECT latitude, longitude, recorded_at
  FROM van_tracking
  WHERE van_id = v.id
  ORDER BY recorded_at DESC
  LIMIT 1
) vt ON true

LEFT JOIN bookings b ON b.van_id = v.id
LEFT JOIN children c ON c.id = b.child_id
LEFT JOIN school_guards sg ON sg.branch_id = c.branch_id
LEFT JOIN school_branches sb ON sb.id = c.branch_id

WHERE sg.guard_id = $1 AND NOT EXISTS (
  SELECT 1 FROM child_leaves cl WHERE cl.child_id = c.id AND cl.is_active = true
)

GROUP BY 
  v.id,
  v.number_plate,
  v.capacity,
  u.full_name,
  u.phone,
  vt.latitude,
  vt.longitude,
  vt.recorded_at, 
  u.profile_photo,
  c.id,
  c.full_name,
  c.child_pic,
  sb.id,
  sb.branch_name

ORDER BY v.id, vt.recorded_at DESC;
        `,
        [socket.user.id],
      );

      const SCHOOL = await getLatLongBySchool(socket.user.id);

      const vans = result.rows.map((van) => {
        let status = "on-route";
        let distance = null;

        if (van.latitude && van.longitude) {
          distance = getDistanceInMeters(
            van.latitude,
            van.longitude,
            SCHOOL.lat,
            SCHOOL.lng,
          );

          if (distance < 50) status = "arrived";
          else if (distance < 500) status = "approaching";
        }

        return {
          vanId: van.van_id,
          vanNumber: van.number_plate,
          driver: van.driver_name,
          phone: van.phone,
          driver_profile_photo: van.profile_photo,
          students: `${van.total_students}/${van.capacity}`,
          school_id: van.school_id,
          child_data: {
            child_pics: van.child_pic ? [van.child_pic] : null,
            child_names: van.child_name ? [van.child_name] : null,
            child_ids: van.child_id ? [van.child_id] : null,
          },
          lat: van.latitude,
          lng: van.longitude,
          lastUpdate: van.recorded_at,
          status,
          distance,
          branch_name: SCHOOL.branch_name,
          schoolLat: SCHOOL.lat,
          schoolLng: SCHOOL.lng,
        };
      });

      socket.emit("vans-status", vans);
    } catch (err) {
      console.error(err);
    }
  }, 10000);

  // All students of each van
  socket.on("get-all-students", async () => {
    try {
      const schoolResult = await pool.query(
        `SELECT branch_id 
       FROM school_guards 
       WHERE guard_id = $1 
         AND approval_status = 'APPROVED'`,
        [socket.user.id],
      );

      if (!schoolResult.rows.length)
        return socket.emit("error", "Guard not assigned to any school");

      const branch_id = schoolResult.rows[0].branch_id;

      const students = await pool.query(
        `
    SELECT DISTINCT ON (C.id)
  C.id,
  C.full_name,
  C.grade,
  C.disease,
  C.child_pic,

  V.id AS van_id,
  V.number_plate AS van_number_plate,

  S.id AS school_id,
  SB.latitude,
  SB.longitude,

  U.full_name AS parent_name,
  U.phone AS parent_phone,

  D.full_name AS driver_name,

  GV.verification_time,
  GV.verification_status

FROM children C

LEFT JOIN bookings B 
  ON B.child_id = C.id AND B.status = 'COMPLETED'

LEFT JOIN vans V 
  ON V.id = B.van_id

LEFT JOIN users U 
  ON U.id = C.parent_id

LEFT JOIN users D 
  ON D.id = V.driver_id
LEFT JOIN school_branches SB ON SB.id = C.branch_id
LEFT JOIN schools S ON S.id = SB.school_id

-- LATEST verification ONLY
LEFT JOIN LATERAL (
  SELECT DISTINCT ON (child_id)
    verification_time, 
    CASE WHEN verification_type IS NULL THEN 'pending'
    ELSE verification_type
    END AS verification_status
  FROM guard_verifications
  WHERE child_id = C.id 
    AND guard_id = $2
  ORDER BY child_id, verification_time DESC
  LIMIT 1
) GV ON true

WHERE C.branch_id = $1 AND NOT EXISTS (
  SELECT 1 FROM child_leaves CL WHERE CL.child_id = C.id AND CL.is_active = true
)
ORDER BY C.id;
      `,
        [branch_id, socket.user.id],
      );
      socket.emit("all-students", students.rows);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Failed to fetch students");
    }
  });

  socket.on("delays-history", async () => {
    try {
      await delayHistoryForGuard(socket);
    } catch (error) {
      console.error(error);
      socket.emit("error", "An error occurred while processing delays");
    }
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Guard disconnected:", socket.id);
  });
};

module.exports = guardModule;

// LEFT JOIN LATERAL (
//   SELECT latitude, longitude, recorded_at
//   FROM van_tracking
//   WHERE van_id = v.id
//   ORDER BY recorded_at DESC
//   LIMIT 2
// ) vt ON true

// 👉 This runs for each van row individually

// BEST VERSION (NO GROUP BY MESS)
// WHY THIS IS BETTER

// ✔ No duplicate rows
// ✔ No heavy GROUP BY
// ✔ Faster for large data
// ✔ Easier to maintain

// SELECT
//   v.id AS van_id,
//   v.number_plate,
//   v.capacity,

//   u.full_name AS driver_name,
//   u.phone,

//   vt.latitude,
//   vt.longitude,
//   vt.recorded_at,

//   COALESCE(cs.total_students, 0) AS total_students

// FROM vans v
// JOIN users u ON u.id = v.driver_id

// -- ✅ latest location
// LEFT JOIN LATERAL (
//   SELECT latitude, longitude, recorded_at
//   FROM van_tracking
//   WHERE van_id = v.id
//   ORDER BY recorded_at DESC
//   LIMIT 1
// ) vt ON true

// -- ✅ student count (separate query)
// LEFT JOIN (
//   SELECT b.van_id, COUNT(DISTINCT c.id) AS total_students
//   FROM bookings b
//   JOIN children c ON c.id = b.child_id
//   GROUP BY b.van_id
// ) cs ON cs.van_id = v.id

// -- ✅ guard filter
// WHERE EXISTS (
//   SELECT 1
//   FROM bookings b
//   JOIN children c ON c.id = b.child_id
//   JOIN school_guards sg ON sg.branch_id = c.branch_id
//   WHERE b.van_id = v.id
//   AND sg.guard_id = $1
// )

// ORDER BY vt.recorded_at DESC;
