const { default: axios } = require("axios");
const { pool } = require("../../utils/dbConnection");

// const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
//   const R = 6371000;
//   const toRad = (val) => (val * Math.PI) / 180;

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// };

// // Nearest Neighbor Algorithm
// const optimizeStops = (stops) => {
//   if (stops.length === 0) return [];

//   const visited = new Set();
//   const ordered = [];

//   // start from first stop (or school)
//   let current = stops[0];
//   ordered.push(current);
//   visited.add(current.id);

//   while (ordered.length < stops.length) {
//     let nearest = null;
//     let minDist = Infinity;

//     for (const stop of stops) {
//       if (visited.has(stop.id)) continue;

//       const dist = getDistanceInMeters(
//         current.lat,
//         current.lng,
//         stop.lat,
//         stop.lng,
//       );

//       if (dist < minDist) {
//         minDist = dist;
//         nearest = stop;
//       }
//     }

//     ordered.push(nearest);
//     visited.add(nearest.id);
//     current = nearest;
//   }

//   return ordered;
// };

const routeDetail = async (req, res) => {
  try {
    const r = await pool.query(
      `
      SELECT
    JSONB_AGG( DISTINCT
      JSONB_BUILD_OBJECT(
        'id', v.id,
        'number_plate', v.number_plate
      )
    ) AS vans,
    JSONB_AGG( DISTINCT
      JSONB_BUILD_OBJECT(
        'child_id', c.id,
        'name', c.full_name,
        'address', c.pickup_address,
        'lat', c.latitude,
        'lng', c.longitude
      )
    ) AS children
FROM vans v
JOIN bookings b ON b.van_id = v.id
JOIN children c ON c.id = b.child_id
WHERE v.driver_id = $1
  AND b.status = 'COMPLETED' AND NOT EXISTS (
    SELECT 1 FROM routes r WHERE r.van_id = v.id AND r.branch_id = c.branch_id
  )
      `,
      [req.user.id],
    );

    res.json({ route: r.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const createNewRoute = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { van_id, stops, pickup_address } = req.body;
    // stops = [{ address, lat, lng }]

    await pool.query("BEGIN");

    const van = await pool.query(
      "SELECT * FROM vans WHERE id=$1 AND driver_id=$2",
      [van_id, driverId],
    );
    if (!van.rowCount) {
      await pool.query("ROLLBACK");
      return res.status(403).json({ message: "Not your van" });
    }

    const getSchool = await pool.query(
      "SELECT branch_id FROM driver_approvals WHERE driver_id=$1",
      [driverId],
    );
    if (!getSchool.rowCount) {
      await pool.query("ROLLBACK");
      return res.status(403).json({ message: "Not your school" });
    }

    const school_id = getSchool.rows[0].branch_id;

    const newRoute = await pool.query(
      "INSERT INTO routes(van_id,name,branch_id) VALUES($1,$2,$3) RETURNING id",
      [van_id, pickup_address, school_id],
    );

    const routeId = newRoute.rows[0].id;

    // const insertedStops = [];

    for (const stop of stops) {
      const s = await pool.query(
        `INSERT INTO route_stops(route_id, latitude, longitude, sequence_no)
         VALUES($1,$2,$3,$4)
         RETURNING id, latitude, longitude`,
        [routeId, stop.lat, stop.lng, stops.indexOf(stop) + 1],
      );

      // insertedStops.push({
      //   id: s.rows[0].id,
      //   lat: s.rows[0].latitude,
      //   lng: s.rows[0].longitude,
      // });
    }

    // Optimize stops (nearest neighbor)
    // const orderedStops = optimizeStops(insertedStops);

    // for (let i = 0; i < orderedStops.length; i++) {
    //   await pool.query("UPDATE route_stops SET sequence_no=$1 WHERE id=$2", [
    //     i + 1,
    //     orderedStops[i].id,
    //   ]);
    // }

    await pool.query("COMMIT");

    res.status(201).json({ routeId });
  } catch (e) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: e.message });
  }
};

getDriverRoutes = async (req, res) => {
  try {
    const r = await pool.query(
      `
      SELECT 
        R.id,
        R.name,
        R.is_active,

        -- School Info
        JSONB_BUILD_OBJECT(
          'id', S.id,
          'address', S.school_name,
          'start_time', SB.start_time,
          'end_time', SB.end_time
        ) AS school,

        -- Stops Count
        (
          SELECT COUNT(*) 
          FROM route_stops RS 
          WHERE RS.route_id = R.id
        ) AS total_stops,

        -- Students Count (active bookings in this van)
        (
          SELECT COUNT(*) 
          FROM bookings B
          WHERE B.van_id = R.van_id
          AND B.status = 'COMPLETED'
        ) AS total_students,

        -- Ordered Stops
        (
          SELECT JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'sequence_no', RS.sequence_no,
              'latitude', RS.latitude,
              'longitude', RS.longitude
            )
            ORDER BY RS.sequence_no
          )
          FROM route_stops RS
          WHERE RS.route_id = R.id
        ) AS stops

      FROM routes R
      JOIN vans V ON V.id = R.van_id
      JOIN school_branches SB ON SB.id = R.branch_id
      JOIN schools S ON S.id = SB.school_id

      WHERE V.driver_id = $1
      `,
      [req.user.id],
    );

    res.json({ routes: r.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateRouteLocation = async (req, res) => {
  try {
    const driverId = req.user.id;
    const routeId = req.params.routeId;
    const { latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE routes
       SET latitude = $1, longitude = $2
       WHERE id = $3 AND driver_id = $4
       RETURNING *`,
      [latitude, longitude, routeId, driverId],
    );

    if (!result.rowCount)
      return res.status(404).json({ message: "Route not found" });

    res.json({ message: "Route location updated", route: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const driverId = req.user.id;
    const routeId = req.params.routeId;

    const result = await pool.query(
      `DELETE FROM routes
       WHERE id = $1 AND driver_id = $2
       RETURNING id`,
      [routeId, driverId],
    );

    if (!result.rowCount)
      return res.status(404).json({ message: "Route not found" });

    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

viewAssignedStudents = async (req, res) => {
  try {
    const q = await pool.query(
      `
    SELECT 
      c.id,c.full_name,
      u.full_name AS parent_name,
      b.id AS booking_id,
      s.id AS school_id,
      s.school_name AS school_address,
      c.pickup_address,
      sb.start_time - INTERVAL '40 minutes' AS pickup_time,
      sb.end_time AS drop_off_time
    FROM bookings b
    JOIN children c ON c.id=b.child_id
    JOIN school_branches sb ON sb.id=c.branch_id
    JOIN schools s ON s.id=sb.school_id
    JOIN users u ON u.id=c.parent_id
    JOIN vans v ON v.id=b.van_id
    WHERE v.driver_id=$1 AND b.status='COMPLETED'
  `,
      [req.user.id],
    );
    res.json({ students: q.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

allStudents = async (req, res) => {
  try {
    const q = await pool.query(
      `
     SELECT DISTINCT ON (C.id)
    TO_JSONB(C) AS child_info,

    JSONB_BUILD_OBJECT(
        'id', S.id,
        'address', S.school_name,
        'pickup_time', SB.start_time - INTERVAL '30 minutes',
        'drop_off_time', SB.end_time
    ) AS school_info,

    JSONB_BUILD_OBJECT(
        'id', R.id,
        'name', R.name
    ) AS route_info,

    JSONB_BUILD_OBJECT(
        'van_id', B.van_id,
        'status', B.status,
        'booked_at', B.booked_at
    ) AS booking_info,

    JSONB_BUILD_OBJECT(
        'id', PU.id,
        'full_name', PU.full_name,
        'email', PU.email,
        'phone', PU.phone,
        'role', PU.role
    ) AS parent_data,

    JSONB_BUILD_OBJECT(
        'id', DU.id,
        'full_name', DU.full_name,
        'email', DU.email,
        'phone', DU.phone,
        'role', DU.role
    ) AS driver_data,

    -- Attendance Info (scalar JSON)
    JSONB_BUILD_OBJECT(
        'total_working_days', COALESCE(aw.total_working_days, 0),
        'present_days', COALESCE(aw.present_days, 0),
        'attendance_percentage', COALESCE(aw.attendance_percentage, 0)
    ) AS attendance_info

FROM bookings B
JOIN children C ON C.id = B.child_id
JOIN vans V ON V.id = B.van_id
JOIN users DU ON DU.id = V.driver_id
JOIN users PU ON PU.id = C.parent_id
JOIN routes R ON R.van_id = V.id
JOIN school_branches SB ON SB.id = C.branch_id
JOIN schools S ON S.id = SB.school_id

-- Attendance subquery per child
LEFT JOIN LATERAL (
    SELECT 
        COUNT(DISTINCT SWD.working_date) AS total_working_days,
        COUNT(DISTINCT DATE(GV.verification_time)) AS present_days,
        ROUND(
            (COUNT(DISTINCT DATE(GV.verification_time)) * 100.0) /
            NULLIF(COUNT(DISTINCT SWD.working_date), 0),
            2
        ) AS attendance_percentage
    FROM school_working_days SWD
    LEFT JOIN guard_verifications GV 
        ON GV.child_id = C.id 
        AND DATE(GV.verification_time) = SWD.working_date
    WHERE SWD.school_id = S.id
      AND SWD.is_working = TRUE
) aw ON TRUE

WHERE V.driver_id = $1
  AND B.status = 'COMPLETED'
  ORDER BY C.id, B.booked_at DESC;

      `,
      [req.user.id],
    );

    res.json({ students: q.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const viewStudentDetails = async (req, res) => {
  try {
    const driverId = req.user.id;
    const childId = req.params.studentId;

    const result = await pool.query(
      `
      SELECT 
        -- Child Info
        TO_JSONB(C) AS child_info,

        -- School Info
        JSONB_BUILD_OBJECT(
          'id', S.id,
          'address', S.school_name,
          'pickup_time', SB.start_time - INTERVAL '30 minutes',
          'drop_off_time', SB.end_time
        ) AS school_info,

        -- Route Info
        JSONB_BUILD_OBJECT(
          'id', R.id,
          'name', R.name
        ) AS route_info,

        -- Booking Info
        JSONB_BUILD_OBJECT(
          'van_id', B.van_id,
          'status', B.status,
          'booked_at', B.booked_at
        ) AS booking_info,

        -- Parent Info
        JSONB_BUILD_OBJECT(
          'id', PU.id,
          'full_name', PU.full_name,
          'email', PU.email,
          'phone', PU.phone,
          'role', PU.role
        ) AS parent_data,

        -- Driver Info
        JSONB_BUILD_OBJECT(
          'id', DU.id,
          'full_name', DU.full_name,
          'email', DU.email,
          'phone', DU.phone,
          'role', DU.role
        ) AS driver_data

      FROM bookings B
      JOIN children C ON C.id = B.child_id
      JOIN vans V ON V.id = B.van_id
      JOIN users DU ON DU.id = V.driver_id
      JOIN users PU ON PU.id = C.parent_id
      JOIN routes R ON R.van_id = V.id
      JOIN school_branches SB ON SB.id = C.branch_id
      JOIN schools S ON S.id = SB.school_id

      WHERE DU.driver_id = $1 AND C.id = $2
    `,
      [driverId, childId],
    );

    if (!result.rowCount)
      return res.status(404).json({ message: "Student not found" });

    res.json({ student: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

getEarningByYear = async (req, res) => {
  try {
    const q = await pool.query(
      `
    SELECT 
    TO_CHAR(date_trunc('month', cp.payment_date), 'YYYY-MM') AS month,

    SUM(cp.amount) AS total,

    COUNT(DISTINCT r.id) AS route_count,

    COUNT(DISTINCT b.child_id) AS child_count,
    (SELECT COUNT(DISTINCT b.child_id) FROM bookings b WHERE b.status = 'COMPLETED') AS active_child_count

FROM cash_payments cp
JOIN bookings b ON b.id = cp.booking_id
JOIN vans v ON v.id = b.van_id
LEFT JOIN routes r ON r.van_id = v.id

WHERE v.driver_id = $1
  AND cp.payment_date >= CURRENT_DATE - INTERVAL '12 months'

GROUP BY date_trunc('month', cp.payment_date)

ORDER BY month;

  `,
      [req.user.id],
    );
    res.json({ earnings: q.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

earningPerStudents = async (req, res) => {
  try {
    const driver_id = req.user.id;

    const earnings = await pool.query(
      `
      SELECT 
        cp.id,
        cp.amount,
        cp.payment_date,
        cp.created_at,
        c.full_name AS child_name,
        cp.payment_status AS status
      FROM cash_payments cp
      JOIN bookings b ON b.id = cp.booking_id
      JOIN children c ON c.id = b.child_id
      JOIN vans v ON v.id = b.van_id
      WHERE v.driver_id = $1
      GROUP BY c.full_name, cp.id, cp.amount, cp.payment_date, cp.created_at
      ORDER BY cp.created_at DESC
      LIMIT 10
      `,
      [driver_id],
    );

    return res.status(200).json(earnings.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

viewPaymentHistory = async (req, res) => {
  try {
    const q = await pool.query(
      `
    SELECT cp.amount,cp.payment_date,c.full_name AS child
    FROM cash_payments cp
    JOIN bookings b ON b.id=cp.booking_id
    JOIN children c ON c.id=b.child_id
    JOIN vans v ON v.id=b.van_id
    WHERE v.driver_id=$1
    ORDER BY cp.payment_date DESC
  `,
      [req.user.id],
    );
    res.json({ payments: q.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const leaveAndAssignNewDriver = async (req, res) => {
  const oldDriverId = req.user.id;
  const { newDriverId, reason, leaveDays, leaveDate } = req.body;

  try {
    await pool.query("BEGIN");

    const verify = await pool.query(
      `SELECT 1 FROM driver_documents 
       WHERE driver_id=$1 AND is_verified=true`,
      [newDriverId],
    );

    if (!verify.rowCount) throw "New driver not verified";

    console.log({ "new driver id": newDriverId, "Old driver id": oldDriverId });

    const isAlreadyAssigned = await pool.query(
      `SELECT 1 FROM vans v INNER JOIN driver_assign da ON da.van_id = v.id WHERE driver_id=$1`,
      [newDriverId],
    );

    if (isAlreadyAssigned.rowCount) throw "New driver already assigned";

    const oldVan = await pool.query(`SELECT id FROM vans WHERE driver_id=$1`, [
      oldDriverId,
    ]);

    if (!oldVan.rowCount) throw "Old driver has no van";

    const vanId = oldVan.rows[0].id;

    const vans = await pool.query(
      `UPDATE vans 
       SET driver_id=$1 
       WHERE id=$2
       RETURNING id`,
      [newDriverId, vanId],
    );

    await pool.query(
      `INSERT INTO driver_assign 
       (old_driver, new_driver, van_id, reason, leave_days, leave_date, assign_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW())`,
      [oldDriverId, newDriverId, vanId, reason, leaveDays, leaveDate],
    );

    await pool.query("COMMIT");

    res.json({
      message: "Driver reassigned successfully",
      vanId,
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(400).json({ message: err.toString() });
  }
};

const restoreDriver = async (req, res) => {
  const { newDriverId } = req.body;
  const oldDriverId = req.user.id;

  try {
    await pool.query("BEGIN");

    const logs = await pool.query(
      `
      SELECT * FROM driver_assign 
      WHERE old_driver=$1
    `,
      [oldDriverId],
    );

    if (!logs.rowCount) throw "Nothing to restore";

    for (const row of logs.rows) {
      await pool.query(
        `
        UPDATE vans SET driver_id=$1 WHERE id=$2
      `,
        [oldDriverId, row.van_id],
      );
    }

    await pool.query("DELETE FROM driver_assign where old_driver=$1", [
      req.user.id,
    ]);

    await pool.query("COMMIT");

    res.json({ message: "Driver restored", vans: logs.rowCount });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(400).json({ message: err.toString() });
  }
};

getAssignedDrivers = async (req, res) => {
  try {
    const q = await pool.query(
      `
    SELECT u.* from users u 
    JOIN driver_assign da ON da.new_driver=u.id WHERE old_driver=$1
  `,
      [req.user.id],
    );
    res.json(q.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

getNewDriversExceptCurrent = async (req, res) => {
  try {
    const getBranchId = await pool.query(
      `
      SELECT branch_id
         FROM driver_approvals
         WHERE driver_id = $1
         AND status = 'APPROVED'
    `,
      [req.user.id],
    );

    if (!getBranchId.rows.length) {
      return res.status(404).json({ message: "Branch not found for driver" });
    }

    const branchId = getBranchId.rows[0].branch_id;

    const q = await pool.query(
      `
    SELECT u.*, AVG(dr.rating) AS rating FROM users u
    JOIN driver_approvals da ON da.driver_id=u.id
    LEFT JOIN driver_ratings dr ON dr.driver_id=u.id
    WHERE u.role='DRIVER' AND u.id<>$1 AND da.branch_id=$2 AND NOT EXISTS (
    SELECT 1
    FROM driver_assign d
    WHERE d.new_driver = da.driver_id
  )
    GROUP BY u.id
  `,
      [req.user.id, branchId],
    );
    res.json(q.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

getFeedback = async (req, res) => {
  try {
    const { parent_id, child_id, rating, comments } = req.body;
    await pool.query(
      `
    INSERT INTO parent_ratings(parent_id,driver_id,child_id,rating,comments)
    VALUES($1,$2,$3,$4,$5)
    ON CONFLICT (driver_id,child_id,parent_id)
    DO UPDATE SET rating=$4,comments=$5
  `,
      [parent_id, req.user.id, child_id, rating, comments],
    );
    res.json({ message: "You have rated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const getFeedbackHistory = async (req, res) => {
  try {
    const child_id = req.params.child_id;
    const driver_id = req.user.id;

    const feedbacks = await pool.query(
      `
      SELECT 
        r.rating,
        r.comments,
        r.created_at,
        u.full_name AS parent_name,
        c.full_name AS child_name
      FROM parent_ratings r
      JOIN users u ON u.id = r.parent_id
      JOIN children c ON c.id = r.child_id
      WHERE r.driver_id = $1 AND r.child_id = $2
      ORDER BY r.created_at DESC
    `,
      [driver_id, child_id],
    );

    return res.status(200).json({ feedbacks: feedbacks.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

doComplaints = async (req, res) => {
  try {
    const { parent_id, description } = req.body;
    await pool.query(
      `
    INSERT INTO complaints(parent_id,driver_id,description,status)
    VALUES($1,$2,$3,'OPEN')
  `,
      [parent_id, req.user.id, description],
    );
    res.json({ message: "Complaint filed" });
  } catch (error) {
    console.error("PG ERROR:", error);
    console.error("DETAIL:", error.detail);
    console.error("CONSTRAINT:", error.constraint);

    return res.status(500).json({
      message: "Server Error",
      error: error.detail,
      constraint: error.constraint,
    });
  }
};

getComplaintsHistory = async (req, res) => {
  try {
    const driver_id = req.user.id;
    const complaints = await pool.query(
      "SELECT * FROM COMPLAINTS WHERE driver_id=$1 ORDER BY created_at DESC",
      [driver_id],
    );
    return res.status(200).json({ complaints: complaints.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

delayReports = async (req, res) => {
  try {
    const driver_id = req.user.id;
    const reports = await pool.query(
      `SELECT DR.*,R.name AS route_name FROM DELAY_REPORTS DR JOIN ROUTES R ON R.id=DR.route_id
       WHERE DR.driver_id=$1 ORDER BY DR.reported_at DESC`,
      [driver_id],
    );
    return res.status(200).json({ reports: reports.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  routeDetail,
  createNewRoute,
  getDriverRoutes,
  updateRouteLocation,
  deleteRoute,
  viewAssignedStudents,
  viewStudentDetails,
  getEarningByYear,
  earningPerStudents,
  viewPaymentHistory,
  leaveAndAssignNewDriver,
  restoreDriver,
  getFeedback,
  getFeedbackHistory,
  doComplaints,
  getComplaintsHistory,
  allStudents,
  delayReports,
  getNewDriversExceptCurrent,
  getAssignedDrivers,
};

// getEarningByMonth = async (req, res) => {
//   try {
//     const driverId = req.user.id;
//     const { month, year } = req.query;
//     let filters = [`V.driver_id = $1`];
//     let values = [driverId];
//     let paramIndex = 2;

//     if (month) {
//       filters.push(`EXTRACT(MONTH FROM P.payment_date) = $${paramIndex}`);
//       values.push(month);
//       paramIndex++;
//     }

//     if (year) {
//       filters.push(`EXTRACT(YEAR FROM P.payment_date) = $${paramIndex}`);
//       values.push(year);
//       paramIndex++;
//     }

//     const query = `
//       SELECT COALESCE(SUM(P.amount), 0) AS total_earnings
//       FROM PAYMENTS P
//       JOIN BOOKINGS B ON P.booking_id = B.id
//       JOIN VANS V ON B.van_id = V.id
//       WHERE ${filters.join(" AND ")}
//     `;

//     const result = await pool.query(query, values);

//     return res
//       .status(200)
//       .json({ total_earnings: result.rows[0].total_earnings });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };
