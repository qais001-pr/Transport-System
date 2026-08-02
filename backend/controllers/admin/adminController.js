const { pool } = require("../../utils/dbConnection");
const logger = require('../../middlewares/loki')
const pendingVerificationDriversRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    logger.info({
      message: "Pending driver verification request received",
      page: Number(page),
      limit: Number(limit),
      offset: Number(offset),
      route: req.originalUrl,
      method: req.method,
    });
    if (page < 1 || offset < 0) {
      logger.warn({
        message: "Invalid pagination values",
        page,
        limit,
        offset,
      });

      return res.status(400).json({ message: "Invalid page or offset values" });
    }
    const query = `
      SELECT 
        U.id AS user_id,
        U.full_name,
        U.email,
        U.phone,
        D.id AS document_id,
        D.driver_license,
        D.vehicle_docs,
        D.vehicle_photo,
        D.number_plate,
        D.is_verified
      FROM users U
      INNER JOIN driver_documents D ON U.id = D.driver_id
      WHERE U.role='DRIVER' AND D.is_verified = FALSE
      ORDER BY D.id DESC
      LIMIT $1 OFFSET $2
    `;
    logger.info({
      message: "Fetching pending driver verification requests from database",
    });
    const result = await pool.query(query, [limit, offset]);

    if (result.rowCount === 0) {
      logger.warn({
        message: "No pending driver verification requests found",
        page: Number(page),
        limit: Number(limit),
      });
      return res.status(404).json({ message: "No pending driver verification requests found" });
    }


    logger.info({
      message: "Pending driver verification requests fetched successfully",
      totalRecords: result.rowCount,
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      message: "Pending verification drivers fetched successfully",
      page: Number(page),
      limit: Number(limit),
      total: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Error fetching pending driver verification requests",
      error: error.message,
      stack: error.stack,
    });
    console.error("Pending Driver Verification Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateDriverVerification = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { is_verified } = req.body;
    logger.info({
      message: "Driver verification update request received",
      documentId,
      is_verified,
      route: req.originalUrl,
      method: req.method,
    });
    logger.info({
      message: "Checking driver document",
      documentId,
    });

    const docCheck = await pool.query(
      "SELECT is_verified FROM driver_documents WHERE id = $1",
      [documentId]
    );

    if (!docCheck.rows[0]) {
      logger.warn({
        message: "Driver document not found",
        documentId,
      });

      return res.status(404).json({ message: "Driver document not found" });
    }

    if (docCheck.rows[0].is_verified) {
      logger.warn({
        message: "Driver already verified",
        documentId,
      });
      return res.status(400).json({ message: "Driver already verified" });
    }

    logger.info({
      message: "Updating driver verification status",
      documentId,
      verificationStatus: is_verified,
    });

    const updateQuery = `
      UPDATE driver_documents
      SET is_verified = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [is_verified, documentId]);
    logger.info({
      message: "Driver verification status updated successfully",
      documentId,
      verificationStatus: result.rows[0].is_verified,
    });
    return res.status(200).json({
      message: "Driver verification status updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to update driver verification status",
      documentId: req.params.documentId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const allComplaints = async (req, res) => {
  try {
    logger.info({
      message: "Fetch all complaints request received",
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching complaints from database",
    });
    const result = await pool.query(`
      SELECT C.*,
             U.full_name AS parent_name,
             D.full_name AS driver_name,
             S.name AS school_name
      FROM complaints C
      LEFT JOIN users U ON U.id = C.parent_id
      LEFT JOIN users D ON D.id = C.driver_id
      LEFT JOIN schools S ON S.id = C.school_id
      ORDER BY C.id DESC
    `);
    logger.info({
      message: "Complaints fetched successfully",
      totalComplaints: result.rowCount,
    });

    return res.status(200).json({
      message: "Complaints fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch complaints",
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


complaintDetails = async (req, res) => {
  try {

    const id = req.params.complaintId;
    const result = await pool.query("SELECT * FROM complaints WHERE id = $1", [
      id,
    ]);

    logger.info({
      message: "Complaint details request received",
      complaintId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching complaint details from database",
      complaintId,
    });

    if (result.rows.length === 0) {
      logger.warn({
        message: "Complaint not found",
        complaintId,
      });

      return res.status(404).json({ message: "Complaint not found" });
    }

    logger.info({
      message: "Complaint details fetched successfully",
      complaintId,
    });
    return res.status(200).json({
      message: "Complaint details fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch complaint details",
      complaintId: req.params.complaintId,
      error: error.message,
      stack: error.stack,
    });

    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

isComplaintSolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_solved } = req.body;

    logger.info({
      message: "Complaint status update request received",
      complaintId: id,
      isSolved: is_solved,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Updating complaint status in database",
      complaintId: id,
    });


    const updateQuery =
      "UPDATE complaints SET is_solved = $1 WHERE id = $2 RETURNING id, is_solved";
    const result = await pool.query(updateQuery, [is_solved, id]);
    if (result.rows.length === 0) {
      logger.warn({
        message: "Complaint not found",
        complaintId: id,
      });

      return res.status(404).json({ message: "Complaint not found" });
    }
    logger.info({
      message: "Complaint status updated successfully",
      complaintId: result.rows[0].id,
      isSolved: result.rows[0].is_solved,
    });
    return res.status(200).json({
      message: "Complaint status updated successfully",
      complaint: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to update complaint status",
      complaintId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    logger.info({
      message: "Fetch all users request received",
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching users from database",
    });
    const result = await pool.query(`
      SELECT 
        U.id,
        U.full_name,
        U.email,
        U.phone,
        U.role,
        U.is_verified,
        COUNT(C.id) AS total_children
      FROM users U
      LEFT JOIN children C ON C.parent_id = U.id
      WHERE U.role != 'ADMIN'
      GROUP BY U.id
      ORDER BY U.id DESC
    `);
    logger.info({
      message: "Users fetched successfully",
      totalUsers: result.rowCount,
    });
    return res.status(200).json({
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch users",
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const viewUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    logger.info({
      message: "User details request received",
      userId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching user details from database",
      userId,
    });
    const result = await pool.query(
      `
      SELECT 
        U.id,
        U.full_name,
        U.email,
        U.phone,
        U.role,
        U.is_verified,

        -- For parents: total children
        CASE 
          WHEN U.role = 'PARENT' THEN (
            SELECT COUNT(*) 
            FROM children C 
            WHERE C.parent_id = U.id
          )
          ELSE NULL
        END AS total_children,

        -- For drivers: driver documents
        CASE
          WHEN U.role = 'DRIVER' THEN (
            SELECT json_agg(json_build_object(
              'document_id', D.id,
              'driver_license', D.driver_license,
              'vehicle_docs', D.vehicle_docs,
              'vehicle_photo', D.vehicle_photo,
              'number_plate', D.number_plate,
              'is_verified', D.is_verified
            ))
            FROM driver_documents D
            WHERE D.driver_id = U.id
          )
          ELSE NULL
        END AS driver_documents

      FROM users U
      WHERE U.id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      logger.warn({
        message: "User not found",
        userId,
      });
      return res.status(404).json({ message: "User not found" });
    }
    logger.info({
      message: "User details fetched successfully",
      userId,
      role: result.rows[0].role,
      isVerified: result.rows[0].is_verified,
    });

    return res.status(200).json({
      message: "User details fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch user details",
      userId: req.params.userId,
      error: error.message,
      stack: error.stack,
    });
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_blocked } = req.body;
    logger.info({
      message: "User block/unblock request received",
      userId: id,
      isBlocked: is_blocked,
      route: req.originalUrl,
      method: req.method,
    });
    logger.info({
      message: "Updating user block status",
      userId: id,
    });
    const result = await pool.query(
      "UPDATE users SET is_blocked = $1 WHERE id = $2 RETURNING id, is_blocked",
      [is_blocked, id]
    );
    if (result.rows.length === 0) {
      logger.warn({
        message: "User not found",
        userId: id,
      });
      return res.status(404).json({ message: "User not found" });
    }
    logger.info({
      message: "User block status updated successfully",
      userId: result.rows[0].id,
      isBlocked: result.rows[0].is_blocked,
    });
    return res.status(200).json({
      message: "User blocked successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to update user block status",
      userId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info({
      message: "User deletion request received",
      userId: id,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Deleting user from database",
      userId: id,
    });


    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) {
      logger.warn({
        message: "User not found",
        userId: id,
      });
      return res.status(404).json({ message: "User not found" });
    }
    logger.info({
      message: "User deleted successfully",
      userId: result.rows[0].id,
    });
    return res.status(200).json({
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to delete user",
      userId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const allDrivers = async (req, res) => {
  try {
    logger.info({
      message: "Fetch all drivers request received",
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching drivers from database",
    });

    const result = await pool.query(`
      SELECT 
        U.id AS driver_id,
        U.full_name,
        U.email,
        U.phone,
        U.is_verified,
        COALESCE(D.docs, '[]') AS driver_documents
      FROM users U
      LEFT JOIN (
        SELECT 
          driver_id,
          json_agg(json_build_object(
            'document_id', id,
            'driver_license', driver_license,
            'vehicle_docs', vehicle_docs,
            'vehicle_photo', vehicle_photo,
            'number_plate', number_plate,
            'is_verified', is_verified
          )) AS docs
        FROM driver_documents
        GROUP BY driver_id
      ) D ON U.id = D.driver_id
      WHERE U.role = 'DRIVER'
      ORDER BY U.id DESC
    `);
    logger.info({
      message: "Drivers fetched successfully",
      totalDrivers: result.rowCount,
    });
    return res.status(200).json({
      message: "Drivers fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch drivers",
      error: error.message,
      stack: error.stack,
    });
    console.error("Error fetching drivers:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const showDriverDetails = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    logger.info({
      message: "Driver details request received",
      driverId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching driver details from database",
      driverId,
    });
    const result = await pool.query(`
      SELECT 
        U.id AS driver_id,
        U.full_name,
        U.email,
        U.phone,
        U.is_verified,
        COALESCE(V.vans, '[]') AS vans,
        COALESCE(D.docs, '[]') AS driver_documents
      FROM users U
      LEFT JOIN (
        SELECT driver_id, json_agg(json_build_object(
          'van_id', id,
          'number_plate', number_plate,
          'capacity', capacity,
          'fare', fare,
          'is_girls_only', is_girls_only,
          'is_active', is_active
        )) AS vans
        FROM vans
        GROUP BY driver_id
      ) V ON U.id = V.driver_id
      LEFT JOIN (
        SELECT driver_id, json_agg(json_build_object(
          'document_id', id,
          'driver_license', driver_license,
          'vehicle_docs', vehicle_docs,
          'vehicle_photo', vehicle_photo,
          'number_plate', number_plate,
          'is_verified', is_verified
        )) AS docs
        FROM driver_documents
        GROUP BY driver_id
      ) D ON U.id = D.driver_id
      WHERE U.id = $1 AND U.role = 'DRIVER';
    `, [driverId]);

    if (result.rows.length === 0) {
      logger.warn({
        message: "Driver not found",
        driverId,
      });
      return res.status(404).json({ message: "Driver not found" });
    }
    logger.info({
      message: "Driver details fetched successfully",
      driverId,
      isVerified: result.rows[0].is_verified,
      totalVans: result.rows[0].vans?.length || 0,
      totalDocuments: result.rows[0].driver_documents?.length || 0,
    });
    return res.status(200).json({
      message: "Driver details fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch driver details",
      driverId: req.params.driverId,
      error: error.message,
      stack: error.stack,
    });
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


const updateStatusDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const { is_verified, availability_status } = req.body;
    logger.info({
      message: "Driver status update request received",
      driverId,
      isVerified: is_verified,
      availabilityStatus: availability_status,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Checking driver existence",
      driverId,
    });
    const driverCheck = await pool.query(
      "SELECT is_verified FROM users WHERE id = $1 AND role = 'DRIVER'",
      [driverId]
    );

    if (driverCheck.rows.length === 0) {
      logger.warn({
        message: "Driver not found",
        driverId,
      });
      return res.status(404).json({ message: "Driver not found" });
    }

    if (driverCheck.rows[0].is_verified && availability_status === "active") {
      logger.warn({
        message: "Driver already verified and active",
        driverId,
      });
      return res.status(400).json({ message: "Driver already verified and active" });
    }
    logger.info({
      message: "Updating driver verification status",
      driverId,
      isVerified: is_verified,
    });
    const update = await pool.query(
      "UPDATE users SET is_verified = $1 WHERE id = $2 RETURNING id, is_verified",
      [is_verified, driverId]
    );
    logger.info({
      message: "Driver verification status updated successfully",
      driverId: update.rows[0].id,
      isVerified: update.rows[0].is_verified,
    });

    return res.status(200).json({
      message: "Driver verification status updated successfully",
      driver: update.rows[0],
    });
  } catch (error) {
    console.error(error);
    logger.error({
      message: "Failed to update driver verification status",
      driverId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const topRatedDrivers = async (req, res) => {
  try {
    const { minRating = 4, limit, page = 1 } = req.query;
    const offset = (page - 1) * (limit || 0);
    logger.info({
      message: "Top-rated drivers request received",
      minRating: Number(minRating),
      limit: limit ? Number(limit) : null,
      page: Number(page),
      offset,
      route: req.originalUrl,
      method: req.method,
    });

    if (minRating < 4 || offset < 0) {
      logger.warn({
        message: "Invalid top-rated drivers request parameters",
        minRating: Number(minRating),
        page: Number(page),
        offset,
      });
      return res.status(400).json({
        message: "Minimum rating should be at least 4 and offset should be non-negative",
      });
    }
    logger.info({
      message: "Fetching top-rated drivers from database",
      minRating: Number(minRating),
    });
    let values = [minRating];
    let query = `
      SELECT 
        U.id AS driver_id,
        U.full_name,
        U.email,
        U.phone,
        COALESCE(F.avg_rating, 0) AS avg_rating,
        COALESCE(F.feedbacks, '[]') AS feedbacks
      FROM users U
      LEFT JOIN (
        SELECT 
          driver_id,
          AVG(rating) AS avg_rating,
          json_agg(json_build_object('rating', rating, 'feedback', feedback)) AS feedbacks
        FROM feedback
        GROUP BY driver_id
      ) F ON U.id = F.driver_id
      WHERE U.role = 'DRIVER' AND COALESCE(F.avg_rating, 0) >= $1
      ORDER BY avg_rating DESC
    `;

    if (limit) {
      query += ` LIMIT $2 OFFSET $3`;
      values.push(limit, offset);
    }

    const result = await pool.query(query, values);
    logger.info({
      message: "Top-rated drivers fetched successfully",
      minRating: Number(minRating),
      totalDrivers: result.rowCount,
    });
    return res.status(200).json({
      message: "Top-rated drivers fetched successfully",
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    console.error(error);
    logger.error({
      message: "Failed to fetch top-rated drivers",
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error" });
  }
};


const allDriversWithDocuments = async (req, res) => {
  try {
    logger.info({
      message: "Drivers with documents request received",
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching drivers with documents from database",
    });
    const result = await pool.query(`
      SELECT 
        U.id AS driver_id,
        U.full_name,
        U.email,
        U.phone,
        COALESCE(D.docs, '[]') AS documents
      FROM users U
      LEFT JOIN (
        SELECT driver_id, json_agg(json_build_object(
          'document_id', id,
          'driver_license', driver_license,
          'vehicle_docs', vehicle_docs,
          'vehicle_photo', vehicle_photo,
          'number_plate', number_plate,
          'is_verified', is_verified
        )) AS docs
        FROM driver_documents
        GROUP BY driver_id
      ) D ON U.id = D.driver_id
      WHERE U.role = 'DRIVER'
      ORDER BY U.id DESC
    `);
    logger.info({
      message: "Drivers with documents fetched successfully",
      totalDrivers: result.rowCount,
    });
    return res.status(200).json({
      message: "Drivers with documents fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch drivers with documents",
      error: error.message,
      stack: error.stack,
    });
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const driversDocumentsDetails = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    logger.info({
      message: "Driver documents request received",
      driverId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching driver documents from database",
      driverId,
    });

    const result = await pool.query(`
      SELECT *
      FROM driver_documents
      WHERE driver_id = $1
      ORDER BY id DESC
    `, [driverId]);

    if (result.rows.length === 0) {
      logger.warn({
        message: "Driver documents not found",
        driverId,
      });
      return res.status(404).json({ message: "Driver documents not found" });
    }
    logger.info({
      message: "Driver documents fetched successfully",
      driverId,
      totalDocuments: result.rowCount,
    });
    return res.status(200).json({
      message: "Driver documents fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch driver documents",
      driverId: req.params.driverId,
      error: error.message,
      stack: error.stack,
    });
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const verifyDriversDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_license, id_card, vehicle_registration, vehicle_photo, number_plate } = req.body;
    logger.info({
      message: "Driver document verification request received",
      documentId: id,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Checking driver document existence",
      documentId: id,
    });
    const doc = await pool.query("SELECT * FROM driver_documents WHERE id = $1", [id]);
    if (doc.rowCount === 0) {
      logger.warn({
        message: "Driver documents not found",
        documentId: id,
      });
      return res.status(404).json({ message: "Driver documents not found" });
    }

    const updateQuery = `
      UPDATE driver_documents
      SET
        driver_license = COALESCE($1, driver_license),
        id_card = COALESCE($2, id_card),
        vehicle_registration = COALESCE($3, vehicle_registration),
        vehicle_photo = COALESCE($4, vehicle_photo),
        number_plate = COALESCE($5, number_plate),
        is_verified = TRUE
      WHERE id = $6
      RETURNING *
    `;

    const updatedResult = await pool.query(updateQuery, [
      driver_license,
      id_card,
      vehicle_registration,
      vehicle_photo,
      number_plate,
      id,
    ]);
    logger.info({
      message: "Driver documents verified successfully",
      documentId: id,
      isVerified: updatedResult.rows[0].is_verified,
    });
    return res.status(200).json({
      message: "Driver documents verified successfully",
      data: updatedResult.rows[0],
    });
  } catch (error) {
    logger.error({
      message: "Failed to verify driver documents",
      documentId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const allRoutesWithDriversAndStops = async (req, res) => {
  try {
    logger.info({
      message: "Routes with drivers and stops request received",
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching routes with drivers and stops from database",
    });
    const result = await pool.query(`
      SELECT 
        R.*,
        json_build_object(
          'driver', json_build_object(
            'id', U.id,
            'name', U.full_name,
            'phone', U.phone
          ),
          'van', json_build_object(
            'van_id', V.id,
            'number_plate', V.number_plate
          )
        ) AS driver_info,
        json_agg(json_build_object(
          'child_id', C.id,
          'child_name', C.name,
          'pickup_location', C.pickup_location
        )) AS children
      FROM routes R
      INNER JOIN users U ON U.id = R.driver_id AND U.role = 'DRIVER'
      INNER JOIN vans V ON V.id = R.van_id
      INNER JOIN children C ON C.van_id = R.van_id
      GROUP BY R.id, U.id, V.id
      ORDER BY R.id DESC
    `);
    logger.info({
      message: "Routes fetched successfully",
      totalRoutes: result.rowCount,
    });
    return res.status(200).json({
      message: "Routes fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    logger.error({
      message: "Failed to fetch routes with drivers and stops",
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const routeDetails = async (req, res) => {
  try {
    const routeId = req.params.routeId;
    logger.info({
      message: "Route details request received",
      routeId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Checking route existence",
      routeId,
    });
    // Check if route exists
    const checkRoute = await pool.query("SELECT * FROM routes WHERE id = $1", [routeId]);
    if (checkRoute.rowCount === 0) {
      logger.warn({
        message: "Route not found",
        routeId,
      });
      return res.status(404).json({ message: "Route not found" });
    }
    logger.info({
      message: "Fetching route details from database",
      routeId,
    });
    const result = await pool.query(`
      SELECT 
        R.*,
        json_build_object(
          'driver', json_build_object(
            'id', U.id,
            'name', U.full_name,
            'phone', U.phone
          ),
          'van', json_build_object(
            'van_id', V.id,
            'number_plate', V.number_plate
          )
        ) AS driver_info,
        json_agg(json_build_object(
          'child_id', C.id,
          'child_name', C.name,
          'pickup_location', C.pickup_location
        )) AS children
      FROM routes R
      INNER JOIN users U ON U.id = R.driver_id AND U.role = 'DRIVER'
      INNER JOIN vans V ON V.id = R.van_id
      INNER JOIN children C ON C.van_id = R.van_id
      WHERE R.id = $1
      GROUP BY R.id, U.id, V.id
    `, [routeId]);

    logger.info({
      message: "Route details fetched successfully",
      routeId,
      totalChildren: result.rows[0]?.children?.length || 0,
    });
    return res.status(200).json({
      message: "Route fetched successfully",
      data: result.rows[0],
    });

  } catch (error) {
    logger.error({
      message: "Failed to fetch route details",
      routeId: req.params.routeId,
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const deleteRoute = async (req, res) => {
  try {
    const routeId = req.params.routeId;

    logger.info({
      message: "Route deletion request received",
      routeId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Checking route existence",
      routeId,
    });

    const checkRoute = await pool.query("SELECT * FROM routes WHERE id = $1", [routeId]);
    if (checkRoute.rowCount === 0) {
      logger.warn({
        message: "Route not found",
        routeId,
      });
      return res.status(404).json({ message: "Route not found" });
    }
    logger.info({
      message: "Deleting route from database",
      routeId,
    });

    const result = await pool.query(
      "DELETE FROM routes WHERE id = $1 RETURNING *",
      [routeId]
    );
    logger.info({
      message: "Route deleted successfully",
      routeId: result.rows[0].id,
    });
    return res.status(200).json({
      message: "Route deleted successfully",
      data: result.rows[0],
    });

  } catch (error) {
    logger.error({
      message: "Failed to delete route",
      routeId: req.params.routeId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const addSchools = async (req, res) => {
  try {

    const { name, address, start_time, end_time } = req.body;

    logger.info({
      message: "Add school request received",
      schoolName: name,
      address,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Checking if school already exists",
      address,
    });

    const existing = await pool.query("SELECT id FROM schools WHERE address = $1", [address]);
    if (existing.rowCount > 0) {
      logger.warn({
        message: "School already exists",
        schoolName: name,
        address,
      });
      return res.status(400).json({ message: "School already added" });
    }
    logger.info({
      message: "Adding new school to database",
      schoolName: name,
      address,
    });
    const result = await pool.query(
      "INSERT INTO schools (name, address, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, address, start_time, end_time]
    );
    logger.info({
      message: "School added successfully",
      schoolId: result.rows[0].id,
      schoolName: result.rows[0].name,
    });
    return res.status(201).json({
      message: "School added successfully",
      data: result.rows[0],
    });

  } catch (error) {
    logger.error({
      message: "Failed to add school",
      schoolName: req.body.name,
      address: req.body.address,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

getSchoolData = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info({
      message: "School details request received",
      schoolId: id,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching school details from database",
      schoolId: id,
    });
    const result = await pool.query("SELECT * FROM schools where id = $1", [
      id,
    ]);
    if (result.rowCount == 0) {
      logger.warn({
        message: "School not found",
        schoolId: id,
      });
      return res.status(404).json({ message: "School not found" });
    }
    logger.info({
      message: "School details fetched successfully",
      schoolId: result.rows[0].id,
      schoolName: result.rows[0].name,
    });
    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    logger.error({
      message: "Failed to fetch school details",
      schoolId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

updateSchoolData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, start_time, end_time } = req.body;
    logger.info({
      message: "School update request received",
      schoolId: id,
      schoolName: name,
      address,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Updating school details",
      schoolId: id,
    });
    const result = await pool.query(
      "UPDATE schools SET name = $1, address = $2, start_time = $3, end_time = $4 WHERE id = $5 RETURNING *",
      [name, address, start_time, end_time, id]
    );
    if (result.rowCount == 0) {
      logger.warn({
        message: "School not found",
        schoolId: id,
      });
      return res.status(404).json({ message: "School not found" });
    }
    logger.info({
      message: "School updated successfully",
      schoolId: result.rows[0].id,
      schoolName: result.rows[0].name,
    });
    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    logger.error({
      message: "Failed to update school",
      schoolId: req.params.id,
      schoolName: req.body.name,
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info({
      message: "School deletion request received",
      schoolId: id,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Deleting school from database",
      schoolId: id,
    });

    const result = await pool.query("DELETE FROM schools WHERE id = $1", [id]);
    if (result.rowCount == 0) {
      logger.warn({
        message: "School not found",
        schoolId: id,
      });
      return res.status(404).json({ message: "School not found" });
    }
    logger.info({
      message: "School deleted successfully",
      schoolId: id,
    });
    return res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    logger.error({
      message: "Failed to delete school",
      schoolId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  pendingVerificationDriversRequests,
  updateDriverVerification,
  allComplaints,
  complaintDetails,
  isComplaintSolved,
  allUsers,
  viewUserDetails,
  blockUser,
  deleteUser,
  allDrivers,
  showDriverDetails,
  updateStatusDriver,
  topRatedDrivers,
  allDriversWithDocuments,
  driversDocumentsDetails,
  verifyDriversDocuments,
  allRoutesWithDriversAndStops,
  routeDetails,
  deleteRoute,
  addSchools,
  getSchoolData,
  updateSchoolData,
  deleteSchool,
};
