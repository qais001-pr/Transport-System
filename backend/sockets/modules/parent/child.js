const { pool } = require("../../../utils/dbConnection");

const childOnRouteDetails = async (socket) => {
  try {
    const result = await pool.query(
      `
       SELECT DISTINCT ON (c.id)
    c.id,
    c.full_name,
    c.branch_id,
    c.latitude AS cLat,
    c.longitude AS cLng,
    c.child_pic,
    DATE_PART('year', AGE(c.date_of_birth)) AS age,

    v.id AS van_id,
    v.number_plate AS van_number,

    d.id AS driver_id,
    d.full_name AS driver_name,
    d.phone,

    dr.average_rating,
    dr.total_reviews,

    sb.latitude AS schoolLat, 
    sb.longitude AS schoolLng, 
    sb.branch_name

FROM children c
LEFT JOIN school_branches sb ON sb.id=c.branch_id
JOIN bookings b ON b.child_id = c.id
JOIN vans v ON v.id = b.van_id
JOIN users d ON d.id = v.driver_id
LEFT JOIN routes r ON r.van_id = v.id

-- ratings
LEFT JOIN LATERAL (
    SELECT 
        ROUND(AVG(rt.rating), 2) AS average_rating,
        COUNT(*) AS total_reviews
    FROM driver_ratings rt
    WHERE rt.driver_id = d.id
) dr ON true

WHERE 
    c.parent_id = $1
    AND b.status = 'COMPLETED'
    AND r.is_active = true
    AND NOT EXISTS (
        SELECT 1 
        FROM child_leaves cl 
        WHERE cl.child_id = c.id AND cl.is_active = true
    )

ORDER BY c.id, b.booked_at DESC;
        `,
      [socket.user.id],
    );

    const schoolRes = await pool.query(
      `SELECT latitude, longitude, branch_name AS name
FROM school_branches
WHERE id = $1`,
      [result.rows[0].branch_id],
    );
    socket.emit("child-on-route-details", {
      students: result.rows,
      school: schoolRes.rows[0],
    });
  } catch (error) {
    console.error(error);
    socket.emit("error", "An error occurred while fetching child bookings");
  }
};

const driverInformationForParent = async (socket) => {
  try {
    const result = await pool.query(
      `
        SELECT DISTINCT
    d.id,
    d.full_name,
    d.phone,
    v.id AS van_id,
    v.number_plate AS van_number,
    dr.average_rating,
    dr.total_reviews
FROM users d
JOIN vans v ON v.driver_id = d.id
JOIN bookings b ON b.van_id = v.id
JOIN children c ON c.id = b.child_id

-- ratings
LEFT JOIN LATERAL (
    SELECT 
        ROUND(AVG(rt.rating), 2) AS average_rating,
        COUNT(*) AS total_reviews
    FROM driver_ratings rt
    WHERE rt.driver_id = d.id
) dr ON true

WHERE 
    c.parent_id = $1
    AND b.status = 'COMPLETED';
        `,
      [socket.user.id],
    );
    socket.emit("driver-information-for-parent", result.rows);
  } catch (error) {
    console.error(error);
    socket.emit("error", "An error occurred while fetching driver information");
  }
};

module.exports = {
  childOnRouteDetails,
  driverInformationForParent,
};
