const { pool } = require("../../utils/dbConnection");
const cron = require("node-cron");
const logger = require('../../middlewares/loki');
const { uploadFile } = require('../../middlewares/helper');
addChildren = async (req, res) => {
  try {
    const {
      branch_id,
      school_id,
      full_name,
      date_of_birth,
      gender,
      grade,
      emergency_contact,
      disease,
      requires_girls_only,
      pickup_address,
      latitude,
      longitude,
    } = req.body;
    const parent_id = req.user.id;

    logger.info({
      message: "Add child request received",
      full_name,
      grade,
    });

    const parent = await pool.query(
      "SELECT id FROM users WHERE id=$1 AND role='PARENT'",
      [parent_id],
    );

    if (!parent.rows.length) {
      logger.warn({
        message: "Parent not found while adding child",
        parent_id,
      });
      return res.status(403).json({ message: "Parent not found" });
    }


    logger.info({
      message: "Parent validation successful",
      parent_id,
    });
    const school = await pool.query(
      "SELECT id FROM schools WHERE id=$1 AND is_active=true AND service_active=true",
      [school_id],
    );

    if (!school.rows.length) {
      logger.warn({
        message: "School service is inactive",
        school_id,
        parent_id,
      });

      return res.status(400).json({ message: "School service inactive" });
    }

    logger.info({
      message: "School validation successful",
      school_id,
    });

    let uploadChildPicture = await uploadFile(
      res.files?.child_pic[0], "users/children"
    );
    
    let child_pic = uploadChildPicture.url;
    
    const requiresGirlsOnly =
      requires_girls_only === "true" || requires_girls_only === true;

    const child = await pool.query(
      `INSERT INTO children (parent_id, branch_id, full_name, date_of_birth, gender, grade, emergency_contact, disease,
      requires_girls_only, child_pic, pickup_address,latitude,longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [
        parent_id,
        branch_id,
        full_name,
        date_of_birth,
        gender.toUpperCase(),
        grade,
        emergency_contact,
        disease,
        requiresGirlsOnly,
        child_pic,
        pickup_address,
        latitude,
        longitude,
      ],
    );
    logger.info({
      message: "Child added successfully",
      child_id: child.rows[0].id,
      parent_id,
      school_id,
      branch_id,
      full_name,
    });

    res.status(201).json({ message: "Child added", childId: child.rows[0].id });
  } catch (e) {
    logger.error({
      message: "Failed to add child",
      error: e.message,
      stack: e.stack,
      parent_id: req.user?.id,
      requestBody: req.body,
    });
    res.status(500).json({ error: e.message });
  }
};

getChildren = async (req, res) => {

  logger.info({
    message: "Fetching children for parent",
  });
  try {
    const children = await pool.query(
      `
      SELECT 
        c.*,
        CASE WHEN b.status = 'COMPLETED' THEN 'active' ELSE 'pending' END AS status,
        s.school_name AS school_name,
        u.full_name AS guardian,
        v.number_plate,
        CASE WHEN v.gender_type='GIRLS_ONLY' THEN true ELSE false END AS van_requires_girls_only
      FROM children c
      JOIN school_branches sb ON sb.id = c.branch_id
      JOIN schools s ON s.id=sb.school_id
      JOIN users u ON u.id = c.parent_id
      LEFT JOIN bookings b ON b.child_id = c.id
      LEFT JOIN vans v ON v.id = b.van_id
      WHERE c.parent_id = $1
      `,
      [req.user.id],
    );

    logger.info({
      message: "Children fetched successfully",
      total_children: children.rowCount,
    });
    res.json(children.rows);
  } catch (err) {
    logger.error({
      message: "Failed to fetch children",
      parent_id: req.user?.id,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

getChildDetails = async (req, res) => {
  logger.info({
    message: "Fetching child details",
    child_id: childId,
    parent_id,
  });
  const child = await pool.query(
    "SELECT * FROM children WHERE id=$1 AND parent_id=$2",
    [req.params.childId, req.user.id],
  );
  if (!child.rows.length) {
    logger.warn({
      message: "Child not found",
      child_id: childId,
      parent_id,
    });
    return res.status(404).json({ message: "Not found" });
  }
  logger.info({
    message: "Child details fetched successfully",
    child_id: childId,
    parent_id,
  });
  res.json(child.rows[0]);
};

updateChild = async (req, res) => {
  try {
    const {
      branch_id,
      school_id,
      full_name,
      date_of_birth,
      gender,
      grade,
      emergency_contact,
      disease,
      requires_girls_only,
      pickup_address,
      latitude,
      longitude,
    } = req.body;

    logger.info({
      message: "Update child request received",
      child_id: childId,
      full_name,
      gender,
    });

    const updates = [];
    const values = [];
    let index = 1;

    if (branch_id !== undefined) {
      updates.push(`branch_id=$${index}`);
      values.push(branch_id);
      index++;
    }

    if (full_name !== undefined) {
      updates.push(`full_name=$${index}`);
      values.push(full_name);
      index++;
    }

    if (date_of_birth !== undefined) {
      updates.push(`date_of_birth=$${index}`);
      values.push(date_of_birth);
      index++;
    }

    if (gender !== undefined) {
      updates.push(`gender=$${index}`);
      values.push(gender.toUpperCase());
      index++;
    }

    if (grade !== undefined) {
      updates.push(`grade=$${index}`);
      values.push(grade);
      index++;
    }

    if (emergency_contact !== undefined) {
      updates.push(`emergency_contact=$${index}`);
      values.push(emergency_contact);
      index++;
    }

    if (disease !== undefined) {
      updates.push(`disease=$${index}`);
      values.push(disease);
      index++;
    }

    if (requires_girls_only !== undefined) {
      updates.push(`requires_girls_only=$${index}`);
      const requiresGirlsOnly =
        requires_girls_only === "true" || requires_girls_only === true;
      values.push(requiresGirlsOnly);
      index++;
    }

    if (req.files?.child_pic?.[0]?.path) {
      updates.push(`child_pic=$${index}`);
      values.push(req.files.child_pic[0].path);
      index++;
    }

    if (pickup_address !== undefined) {
      updates.push(`pickup_address=$${index}`);
      values.push(pickup_address);
      index++;
    }
    if (latitude !== undefined) {
      updates.push(`latitude=$${index}`);
      values.push(latitude);
      index++;
    }
    if (longitude !== undefined) {
      updates.push(`longitude=$${index}`);
      values.push(longitude);
      index++;
    }

    if (updates.length === 0) {
      logger.warn({
        message: "No fields provided for child update",
        child_id: childId,
        parent_id,
      });
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(req.params.childId, req.user.id);

    const query = `
      UPDATE children 
      SET ${updates.join(", ")}
      WHERE id=$${index} AND parent_id=$${index + 1} 
      RETURNING id
    `;

    const child = await pool.query(query, values);

    if (!child.rows.length) {
      logger.warn({
        message: "Child not found for update",
        child_id: childId,
        parent_id,
      });
      return res.status(404).json({ message: "Child not found" });
    }
    logger.info({
      message: "Child updated successfully",
      child_id: child.rows[0].id,
      parent_id,
    });
    res.json({ message: "Updated", childId: child.rows[0].id });
  } catch (e) {
    logger.error({
      message: "Failed to update child",
      child_id: req.params.childId,
      parent_id: req.user?.id,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: e.message });
  }
};

deleteChild = async (req, res) => {
  logger.info({
    message: "Delete child request received",
    parent_id: req.user.id,
    child_id: req.params.childId,
  });
  const del = await pool.query(
    "DELETE FROM children WHERE id=$1 AND parent_id=$2 RETURNING id",
    [req.params.childId, req.user.id],
  );
  if (!del.rows.length) {
    logger.warn({
      message: "Child not found for deletion",
      parent_id: req.user.id,
      child_id: req.params.childId,
    });
    return res.status(404).json({ message: "Not found" });
  }
  logger.info({
    message: "Child deleted successfully",
    parent_id: req.user.id,
    child_id: del.rows[0].id,
  });
  res.json({ message: "Deleted" });
};

getFeedback = async (req, res) => {
  try {
    const { driver_id, child_id, rating, comments } = req.body;
    logger.info({
      message: "Driver feedback request received",
      parent_id: req.user.id,
      driver_id,
      child_id,
      rating,
    });
    await pool.query("BEGIN");
    const exists = await pool.query(
      "SELECT id FROM users WHERE id=$1 AND role='DRIVER'",
      [driver_id],
    );
    if (!exists.rows.length) {
      await pool.query("ROLLBACK");
      logger.warn({
        message: "Driver not found",
        driver_id,
        parent_id: req.user.id,
      });
      return res.status(404).json({ message: "Driver not found" });
    }

    const fb = await pool.query(
      `INSERT INTO driver_ratings (driver_id,parent_id,child_id,rating,comments)
     VALUES ($1,$2,$3,$4,$5) ON CONFLICT (driver_id,child_id,parent_id) DO UPDATE SET rating=$4, comments=$5`,
      [driver_id, req.user.id, child_id, rating, comments],
    );
    await pool.query("COMMIT");
    logger.info({
      message: "Driver rated successfully",
      parent_id: req.user.id,
      driver_id,
      child_id,
      rating,
    });
    res
      .status(201)
      .json({ message: "You have rated successfully", rating: fb.rows[0] });
  } catch (error) {
    logger.error({
      message: "Failed to submit driver feedback",
      parent_id: req.user?.id,
      driver_id,
      child_id,
      error: error.message,
      stack: error.stack,
    });
    await pool.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
};

getVanFeedback = async (req, res) => {
  try {
    const { van_id, rating, comments } = req.body;


    logger.info({
      message: "Van feedback request received",
      parent_id: req.user.id,
      van_id,
      rating,
    });

    const ratingInt = Number(rating);

    if (!Number.isInteger(ratingInt) || ratingInt < 1 || ratingInt > 5) {
      logger.warn({
        message: "Invalid van rating",
        parent_id: req.user.id,
        van_id,
        rating,
      });
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    await pool.query("BEGIN");

    const exists = await pool.query("SELECT id FROM vans WHERE id=$1", [
      van_id,
    ]);

    if (!exists.rows.length) {
      await pool.query("ROLLBACK");
      logger.warn({
        message: "Van not found",
        parent_id: req.user.id,
        van_id,
      });
      return res.status(404).json({ message: "Van not found" });
    }

    // Check if rating already exists
    const existingRating = await pool.query(
      "SELECT id FROM van_ratings WHERE van_id=$1 AND parent_id=$2",
      [van_id, req.user.id],
    );

    let fb;
    if (existingRating.rows.length > 0) {
      // Update existing rating
      fb = await pool.query(
        "UPDATE van_ratings SET rating=$1, comments=$2 WHERE van_id=$3 AND parent_id=$4 RETURNING *",
        [ratingInt, comments, van_id, req.user.id],
      );
      logger.info({
        message: "Van rating updated",
      });
    } else {
      // Insert new rating
      fb = await pool.query(
        "INSERT INTO van_ratings (van_id, parent_id, rating, comments) VALUES ($1, $2, $3, $4) RETURNING *",
        [van_id, req.user.id, ratingInt, comments],
      );
    }

    await pool.query("COMMIT");
    logger.info({
      message: "Van rated successfully",
      parent_id: req.user.id,
      van_id,
      rating: ratingInt,
    });
    res.status(201).json({
      message: "You have rated successfully",
      rating: fb.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to submit van feedback",
      parent_id: req.user?.id,
      van_id,
      error: error.message,
      stack: error.stack,
    });
    await pool.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
};

getFeedbackHistory = async (req, res) => {
  logger.info({
    message: "Fetching driver feedback history",
    parent_id: req.user.id,
  });
  const data = await pool.query(
    `SELECT d.id, d.full_name AS driver, r.rating, r.comments, r.created_at
     FROM driver_ratings r
     JOIN users d ON d.id=r.driver_id
     WHERE r.parent_id=$1
     ORDER BY r.created_at DESC`,
    [req.user.id],
  );
  logger.info({
    message: "Driver feedback history fetched",
    parent_id: req.user.id,
    total_feedbacks: data.rowCount,
  });
  res.json(data.rows);
};

doComplaints = async (req, res) => {
  const { driver_id, school_id, description } = req.body;
  logger.info({
    message: "Complaint submission request received",
    parent_id: req.user.id,
    driver_id,
    school_id,
  });
  const comp = await pool.query(
    `INSERT INTO complaints (parent_id,driver_id,school_id,description)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.user.id, driver_id, school_id, description],
  );
  logger.info({
    message: "Complaint submitted successfully",
    complaint_id: comp.rows[0].id,
    parent_id: req.user.id,
    driver_id,
    school_id,
  });
  res.status(201).json({ message: "Complaint filed", complaint: comp.rows[0] });
};

getComplaintsHistory = async (req, res) => {
  logger.info({
    message: "Fetching complaints history",
    parent_id: req.user.id,
  });
  const rows = await pool.query(
    "SELECT * FROM complaints WHERE parent_id=$1 ORDER BY created_at DESC",
    [req.user.id],
  );
  logger.info({
    message: "Complaints history fetched successfully",
    parent_id: req.user.id,
    total_complaints: rows.rowCount,
  });
  res.json(rows.rows);
};
getAllBookedDrivers = async (req, res) => {
  logger.info({
    message: "Fetching booked drivers",
    parent_id: req.user.id,
  });
  const data = await pool.query(
    `SELECT DISTINCT ON (d.id)
    d.id,
    d.full_name,
    d.email,
    d.phone,
    d.profile_photo,
    v.id AS van_id,
    v.number_plate AS van_number_plate,
    b.booked_at,
    b.status,
    c.id AS child_id
FROM bookings b
LEFT JOIN children c ON c.id = b.child_id
LEFT JOIN vans v ON v.id = b.van_id
JOIN users d ON d.id = v.driver_id
WHERE c.parent_id = $1
ORDER BY d.id, b.booked_at DESC;`,
    [req.user.id],
  );
  logger.info({
    message: "Booked drivers fetched successfully",
    parent_id: req.user.id,
    total_drivers: data.rowCount,
  });
  res.json(data.rows);
};

const getChildrenForLeave = async (req, res) => {
  logger.info({
    message: "Fetching children eligible for leave",
    parent_id: req.user.id,
  });
  try {
    const data = await pool.query(
      `
      SELECT c.id, c.full_name
      FROM children c
      WHERE c.parent_id = $1
      AND NOT EXISTS (
        SELECT 1 FROM child_leaves cl 
        WHERE cl.child_id = c.id
      )
      `,
      [req.user.id],
    );
    logger.info({
      message: "Eligible children fetched successfully",
      parent_id: req.user.id,
      total_children: data.rowCount,
    });
    return res.json(data.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

getLeaveHistory = async (req, res) => {
  logger.info({
    message: "Fetching leave history",
    parent_id: req.user.id,
  });
  try {
    const data = await pool.query(
      `SELECT c.full_name AS child_name, cl.id, cl.reason, cl.leave_days, cl.created_at, cl.leave_date 
      FROM child_leaves cl
     JOIN children c ON c.id=cl.child_id
     WHERE parent_id=$1 ORDER BY created_at DESC`,
      [req.user.id],
    );
    logger.info({
      message: "Leave history fetched successfully",
      parent_id: req.user.id,
      total_records: data.rowCount,
    });
    res.json(data.rows);
  } catch (error) {
    logger.error({
      message: "Failed to fetch leave history",
      parent_id: req.user?.id,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message });
  }
};

const leaveChildren = async (req, res) => {
  try {
    await pool.query("BEGIN");

    const { childId, childIds, reason, leave_days, leave_date, isMultiple } =
      req.body;
    logger.info({
      message: "Leave request received",
      parent_id: req.user.id,
      childId,
      childIds,
      leave_days,
      leave_date,
      isMultiple,
    });

    if (!isMultiple) {
      const childCheck = await pool.query(
        "SELECT id FROM children WHERE id=$1 AND parent_id=$2",
        [childId, req.user.id],
      );

      if (!childCheck.rows.length) {
        await pool.query("ROLLBACK");
        logger.warn({
          message: "Child not found for leave request",
          parent_id: req.user.id,
          child_id: childId,
        });
        return res.status(404).json({ message: "Child not found" });
      }

      const exists = await pool.query(
        "SELECT 1 FROM child_leaves WHERE child_id=$1 AND leave_days=$2 AND is_active=true",
        [childId, leave_days],
      );

      if (exists.rows.length) {
        await pool.query("ROLLBACK");
        logger.warn({
          message: "Leave already exists",
          parent_id: req.user.id,
          child_id: childId,
        });
        return res.status(400).json({
          message: "Leave already exists for this child",
        });
      }

      const insert = await pool.query(
        `INSERT INTO child_leaves
  (
    child_id,
    reason,
    leave_date,
    leave_days,
    return_date,
    created_at
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $3::date + $4::int,
    NOW()
  )
  RETURNING *`,
        [childId, reason, leave_date, leave_days],
      );

      await pool.query("UPDATE children set on_leave=true WHERE id=$1", [
        childId,
      ]);

      await pool.query("COMMIT");
      logger.info({
        message: "Leave added successfully",
        parent_id: req.user.id,
        child_id: childId,
        leave_days,
      });
      return res.json({
        message: "Leave added successfully",
        data: insert.rows[0],
      });
    }

    if (!Array.isArray(childIds) || childIds.length === 0) {
      logger.warn({
        message: "Invalid childIds array",
        parent_id: req.user.id,
      });
      await pool.query("ROLLBACK");
      return res.status(400).json({
        message: "childIds must be a non-empty array",
      });
    }

    let added = [];
    let skipped = [];

    for (const id of childIds) {
      const childCheck = await pool.query(
        "SELECT id FROM children WHERE id=$1 AND parent_id=$2",
        [id, req.user.id],
      );

      if (!childCheck.rows.length) {
        logger.warn({
          message: "Child skipped during leave processing",
          parent_id: req.user.id,
          child_id: id,
          reason: "Child not found",
        });
        skipped.push({ childId: id, reason: "Child not found" });
        continue;
      }

      const exists = await pool.query(
        "SELECT 1 FROM child_leaves WHERE child_id=$1 AND is_active=true",
        [id],
      );

      if (exists.rows.length) {
        logger.warn({
          message: "Child skipped during leave processing",
          parent_id: req.user.id,
          child_id: id,
          reason: "Leave already exists",
        });
        skipped.push({
          childId: id,
          reason: "Leave already exists for this child",
        });
        continue;
      }

      await pool.query(
        `INSERT INTO child_leaves
  (
    child_id,
    reason,
    leave_date,
    leave_days,
    return_date,
    created_at
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $3::date + $4::int,
    NOW()
  )
  RETURNING *`,
        [childId, reason, leave_date, leave_days],
      );
      logger.info({
        message: "Multiple leave request processed",
        parent_id: req.user.id,
        added_count: added.length,
        skipped_count: skipped.length,
      });
      await pool.query("UPDATE children set on_leave=true WHERE id=$1", [
        childId,
      ]);

      added.push(id);
    }

    if (added.length === 0) {
      await pool.query("ROLLBACK");
      logger.warn({
        message: "No leave requests were processed",
        parent_id: req.user.id,
        skipped_count: skipped.length,
      });
      return res.status(400).json({
        message:
          "No leaves added (all skipped) beacause children already have leaves or not found",
        skipped,
      });
    }

    await pool.query("COMMIT");

    return res.json({
      message: "Leaves processed successfully",
      added,
      skipped,
    });
  } catch (e) {
    logger.error({
      message: "Failed to process leave request",
      parent_id: req.user?.id,
      child_id: childId,
      child_ids: childIds,
      error: e.message,
      stack: e.stack,
    });
    await pool.query("ROLLBACK");
    return res.status(500).json({ error: e.message });
  }
};

const autoResetLeaves = async () => {
  try {

    const result = await pool.query(`
      UPDATE children c
      SET on_leave = false
      FROM child_leaves cl
      WHERE cl.child_id = c.id
      AND cl.is_active = true
      AND cl.return_date <= CURRENT_DATE
    `);

    await pool.query(`
      UPDATE child_leaves
      SET is_active = false
      WHERE is_active = true
      AND return_date <= CURRENT_DATE
    `);

    console.log("Expired leaves reset successfully");
    logger.info({
      message: "Expired leaves reset successfully",
      affected_children: result.rowCount,
    });
  } catch (e) {
    logger.error({
      message: "Failed to auto reset expired leaves",
      error: e.message,
      stack: e.stack,
    });
  }
};

module.exports = {
  addChildren,
  getChildren,
  getChildDetails,
  updateChild,
  deleteChild,
  getFeedback,
  getFeedbackHistory,
  doComplaints,
  getComplaintsHistory,
  getAllBookedDrivers,
  getLeaveHistory,
  leaveChildren,
  getChildrenForLeave,
  autoResetLeaves,
  getVanFeedback,
};

// cron.schedule("0 0 * * *", async () => {
//   console.log("Running leave reset job...");
//   await autoResetLeaves();
// });

// import axios from "axios";
// import pool from "../db"; // your PostgreSQL pool

// const addChildren = async (req, res) => {
//   try {
//     const {
//       branch_id,
//       school_id,
//       full_name,
//       date_of_birth,
//       gender,
//       grade,
//       emergency_contact,
//       disease,
//       requires_girls_only,
//       pickup_address,
//     } = req.body;
//     const parent_id = req.user.id;

//     // --- Check if we already have coordinates for this address ---
//     const cached = await pool.query(
//       "SELECT lat, lng FROM address_cache WHERE address = $1",
//       [pickup_address]
//     );

//     let location;

//     if (cached.rows.length) {
//       location = {
//         lat: cached.rows[0].lat,
//         lng: cached.rows[0].lng,
//       };
//       console.log("Using cached coordinates:", location);
//     } else {
//       // --- Fetch from Nominatim ---
//       const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//         pickup_address
//       )}`;

//       const geoResp = await axios.get(nominatimUrl, {
//         headers: {
//           "User-Agent": "VanPoolingApp/1.0 (+yourdomain.com)",
//         },
//       });

//       if (!geoResp.data.length)
//         return res.status(400).json({ message: "Address not found" });

//       location = {
//         lat: parseFloat(geoResp.data[0].lat),
//         lng: parseFloat(geoResp.data[0].lon),
//       };

//       // --- Save coordinates to cache for future ---
//       await pool.query(
//         "INSERT INTO address_cache (address, lat, lng) VALUES ($1,$2,$3)",
//         [pickup_address, location.lat, location.lng]
//       );

//       console.log("Coordinates saved to cache:", location);
//     }

//     // --- Insert child into DB ---
//     // const child = await pool.query(
//     //   `INSERT INTO children
//     //    (parent_id, branch_id, full_name, date_of_birth, gender, grade, emergency_contact, disease,
//     //     requires_girls_only, pickup_address, lat, lng)
//     //    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
//     //    RETURNING id`,
//     //   [
//     //     parent_id,
//     //     branch_id,
//     //     full_name,
//     //     date_of_birth,
//     //     gender.toUpperCase(),
//     //     grade,
//     //     emergency_contact,
//     //     disease,
//     //     requires_girls_only === "true",
//     //     pickup_address,
//     //     location.lat,
//     //     location.lng,
//     //   ]
//     // );

//     res.status(201).json({ message: "Child added", coordinates: location });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e.message });
//   }
// };

// export default addChildren;
