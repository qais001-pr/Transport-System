const { uploadFile } = require("../../middlewares/helper");
const { pool } = require("../../utils/dbConnection");

getVans = async (req, res) => {
  try {
    const vans = await pool.query(`
      SELECT 
    v.id::int,
    v.driver_id::int,
    v.number_plate,
    v.capacity::int,
    v.fare::float,
    v.gender_type,
    v.photo_url,
    v.is_active,

    u.full_name AS driver_name,
    u.profile_photo AS driver_profile_photo,

    (SELECT COALESCE(AVG(dr.rating), 0)::float 
     FROM driver_ratings dr 
     WHERE dr.driver_id = v.driver_id) AS average_rating,
     
    (SELECT COUNT(DISTINCT dr.id)::int
     FROM driver_ratings dr
     WHERE dr.driver_id = v.driver_id) AS total_reviews,

    (SELECT (v.capacity-COUNT(DISTINCT b.id))::float FROM bookings b WHERE b.van_id = v.id AND b.status = 'COMPLETED') AS available_seats

    FROM vans v
    INNER JOIN users u ON u.id = v.driver_id
    INNER JOIN driver_approvals da ON da.driver_id = v.driver_id
    INNER JOIN children c ON c.branch_id = da.branch_id
    INNER JOIN school_branches sb ON sb.id = da.branch_id
    INNER JOIN schools s ON s.id = sb.school_id
    WHERE v.is_active = true AND da.status = 'APPROVED' AND da.approved_at IS NOT NULL 
    GROUP BY v.id, u.full_name, u.profile_photo;
    `);

    res.json({ vans: vans.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const bookVan = async (req, res) => {
  const vanId = req.params.id;
  let { childId } = req.body;
  const parentId = req.user.id;

  console.log("Booking van:", vanId, "for child:", childId);

  try {
    await pool.query("BEGIN");

    const vanRes = await pool.query(
      "SELECT * FROM vans WHERE id=$1 AND is_active=true",
      [vanId],
    );

    if (!vanRes.rows.length) {
      await pool.query("ROLLBACK");
      throw new Error("Van not found or inactive");
    }

    const van = vanRes.rows[0];

    if (!Array.isArray(childId)) childId = [childId];

    const bookings = [];

    for (let id of childId) {
      const childRes = await pool.query(
        "SELECT *,DATE_PART('year', AGE(date_of_birth)) AS age FROM children WHERE id=$1 AND parent_id=$2",
        [id, parentId],
      );

      if (!childRes.rows.length) {
        await pool.query("ROLLBACK");
        throw new Error(`Child with ID ${id} not found`);
      }

      const child = childRes.rows[0];
      console.log("child", child.age, child.gender, van.gender_type);

      if (
        van.gender_type === "GIRLS_ONLY" &&
        (child.gender !== "FEMALE" || child.age < 10)
      ) {
        await pool.query("ROLLBACK");
        throw new Error(
          `Child ${child.full_name} is not eligible for girls-only van (must be female and age 10 or above)`,
        );
      }

      const usedRes = await pool.query(
        "SELECT COUNT(*) FROM bookings WHERE van_id=$1 AND status IN ('ACTIVE','COMPLETED')",
        [vanId],
      );

      if (parseInt(usedRes.rows[0].count) >= van.capacity) {
        await pool.query("ROLLBACK");
        throw new Error("Van is full");
      }

      console.log("child id", id);
      const existsRes = await pool.query(
        "SELECT 1 FROM bookings WHERE child_id=$1 AND status IN ('ACTIVE','COMPLETED')",
        [id],
      );

      if (existsRes.rows.length) {
        await pool.query("ROLLBACK");
        throw new Error(
          `Child ${child.full_name} already has an active booking`,
        );
      }

      const bookingRes = await pool.query(
        "INSERT INTO bookings (child_id, van_id, status) VALUES ($1,$2,'ACTIVE') RETURNING *",
        [id, vanId],
      );

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);

      await pool.query(
        "INSERT INTO cash_payments (booking_id, parent_id, amount, due_date) VALUES ($1,$2,$3,$4)",
        [bookingRes.rows[0].id, parentId, van.fare, dueDate],
      );

      await pool.query("UPDATE vans SET capacity=capacity-1 WHERE id=$1", [
        vanId,
      ]);

      bookings.push(bookingRes.rows[0]);
    }

    await pool.query("COMMIT");

    res.status(201).json({
      message: "Booked successfully",
      bookings,
    });
  } catch (err) {
    await pool.query("ROLLBACK");

    console.error("Booking error:", err);

    res.status(400).json({
      error: err.message || "Booking failed",
    });
  }
};

getVanDetails = async (req, res) => {
  const { vanId } = req.params;

  const van = await pool.query(
    `
    SELECT 
      v.*,
      u.full_name AS driver_name,
      (SELECT COUNT(*) FROM bookings WHERE van_id=v.id AND status='COMPLETED') AS booked_seats
    FROM vans v
    LEFT JOIN users u ON u.id=v.driver_id
    WHERE v.id=$1
  `,
    [vanId],
  );

  if (!van.rows.length)
    return res.status(404).json({ message: "Van not found" });
  res.json({ van: van.rows[0] });
};

updateVanStatus = async (req, res) => {
  const { vanId } = req.params;
  const { is_active } = req.body;

  const v = await pool.query(
    "UPDATE vans SET is_active=$1 WHERE id=$2 RETURNING *",
    [is_active, vanId],
  );
  if (!v.rows.length) return res.status(404).json({ message: "Van not found" });
  res.json({ message: "Status updated", van: v.rows[0] });
};

getVans = async (req, res) => {
  try {
    const driver_id = req.user.id;

    const vans = await pool.query("SELECT * FROM vans WHERE driver_id = $1", [
      driver_id,
    ]);

    return res.status(200).json({ vans: vans.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

addVan = async (req, res) => {
  try {
    const { number_plate, capacity, fare, gender } = req.body;
    await pool.query("BEGIN");
    const van_pic = await uploadFile(req.files?.photo_url[0]);

    const photo_url = van_pic.url;

    await pool.query(
      `INSERT INTO vans (number_plate, driver_id, capacity,fare,gender_type,photo_url,is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [number_plate, req.user.id, capacity, fare, gender, photo_url, true],
    );
    await pool.query("COMMIT");
    return res.status(200).json({ message: "Van added successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

updateVan = async (req, res) => {
  try {
    const vanId = req.params.vanId;
    const { number_plate, capacity, fare, gender } = req.body;
    
    const van_pic = await uploadFile(req.files?.photo_url[0]);

    const photo_url = van_pic.url;

    console.log("FILES:", req.files);

    await pool.query("BEGIN");

    const isExisting = await pool.query(
      `SELECT 1 FROM vans WHERE id=$1 AND driver_id=$2`,
      [vanId, req.user.id],
    );
    if (!isExisting.rowCount) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Van not found" });
    }

    const result = await pool.query(
      `UPDATE vans SET number_plate=$1, capacity=$2, fare=$3, gender_type=$4, photo_url=$5 WHERE id=$6 AND driver_id=$7`,
      [number_plate, capacity, fare, gender, photo_url, vanId, req.user.id],
    );

    await pool.query("COMMIT");

    return res.status(200).json({ message: "Van updated successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

deleteVan = async (req, res) => {
  try {
    const vanId = req.params.vanId;

    await pool.query("BEGIN");

    const isExisting = await pool.query(
      `SELECT 1 FROM vans WHERE id=$1 AND driver_id=$2`,
      [vanId, req.user.id],
    );
    if (!isExisting.rowCount) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Van not found" });
    }

    await pool.query(`DELETE FROM vans WHERE id=$1 AND driver_id=$2`, [
      vanId,
      req.user.id,
    ]);
    await pool.query("COMMIT");

    return res.status(200).json({ message: "Van deleted successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getVans,
  bookVan,
  getVanDetails,
  updateVanStatus,
  getVans,
  addVan,
  updateVan,
  deleteVan,
};
