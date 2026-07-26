const { pool } = require("../../../../utils/dbConnection");

const delayHistoryForGuard = async (socket) => {
  try {
    if (socket.user.role !== "GUARD") {
      return socket.emit("error", "Access denied");
    }
    const guardId = socket.user.id;
    const getBranchIdResult = await pool.query(
      `
        SELECT branch_id FROM school_guards WHERE guard_id = $1 AND approval_status = 'APPROVED'
        `,
      [guardId],
    );
    if (getBranchIdResult.rows.length === 0) {
      socket.emit("error", "Guard not assigned to any school");
      return;
    }
    const branchId = getBranchIdResult.rows[0].branch_id;

    const driverRes = await pool.query(
      `
        SELECT driver_id FROM driver_approvals WHERE branch_id = $1 AND status = 'APPROVED'
        `,
      [branchId],
    );

    const driverIds = driverRes.rows.map((d) => d.driver_id);

    if (driverIds.length === 0) {
      return socket.emit("delays-history", []);
    }

    const result = await pool.query(
      `SELECT dp.* , v.number_plate, d.full_name AS driver_name
       FROM delay_reports dp
       INNER JOIN vans v ON dp.van_id = v.id
       INNER JOIN users d ON dp.driver_id = d.id
       WHERE dp.driver_id = ANY($1)
       ORDER BY dp.reported_at DESC`,
      [driverIds],
    );
    socket.emit("delays-history", result.rows);
  } catch (error) {
    console.error(error);
    socket.emit("error", "An error occurred while processing delays");
  }
};

const removeDelay = async (socket, delayId) => {
  try {
    if (socket.user.role !== "GUARD") {
      return socket.emit("error", "Access denied");
    }
    const guardId = socket.user.id;
    await pool.query(
      `
        DELETE FROM delay_reports WHERE id = $1 AND driver_id = $2
        `,
      [delayId, guardId],
    );
    socket.emit("delay-removed", delayId);
  } catch (error) {
    console.error(error);
    socket.emit("error", "An error occurred while removing delay");
  }
};

module.exports = {
  delayHistoryForGuard,
  removeDelay,
};
