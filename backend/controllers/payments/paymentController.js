const { pool } = require("../../utils/dbConnection");

getPaymentHistory = async (req, res) => {
  try {
    const parent_id = req.user.id;
    logger.info({
      message: "Payment history request received",
      parentId: parent_id,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching payment history from database",
      parentId: parent_id,
    });
    const payments = await pool.query(
      `
      SELECT 
          cp.id,
          cp.amount,
          cp.payment_status,
          cp.payment_date,
          cp.proof_photo,
          cp.due_date,
          b.id AS booking_id,
          jsonb_agg(to_jsonb(c.*)) AS children,
          v.number_plate AS van_number,
          u.full_name AS driver_name
      FROM cash_payments cp
      JOIN bookings b ON b.id = cp.booking_id
      JOIN children c ON c.id = b.child_id
      LEFT JOIN vans v ON v.id = b.van_id
      LEFT JOIN users u ON u.id = v.driver_id
      WHERE cp.parent_id = $1
      GROUP BY cp.id, b.id, v.id, u.id
      ORDER BY cp.payment_date DESC
    `,
      [parent_id],
    );
    logger.info({
      message: "Payment history fetched successfully",
      parentId: parent_id,
      totalPayments: payments.rowCount,
    });
    res.status(200).json({ payments: payments.rows });
  } catch (error) {
    logger.error({
      message: "Failed to fetch payment history",
      parentId: req.user?.id,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

payNow = async (req, res) => {
  try {
    await pool.query("BEGIN");
    const booking_id = req.params.booking_id;
    const parent_id = req.user.id;

    const proof_photo = req?.files?.proof_photo?.[0]?.path;

    logger.info({
      message: "Payment request received",
      bookingId: booking_id,
      parentId: parent_id,
      route: req.originalUrl,
      method: req.method,
    });

    if (!proof_photo) {
      logger.warn({
        message: "Payment proof not provided",
        bookingId: booking_id,
        parentId: parent_id,
      });
      return res.status(400).json({ message: "Payment proof required" });
    }
    logger.info({
      message: "Verifying pending payment record",
      bookingId: booking_id,
      parentId: parent_id,
    });

    const isBooking = await pool.query(
      `
      SELECT * FROM cash_payments WHERE booking_id = $1 AND parent_id = $2 AND payment_status = 'PENDING'
    `,
      [booking_id, parent_id],
    );

    if (!isBooking.rows.length) {
      logger.warn({
        message: "Pending payment record not found",
        bookingId: booking_id,
        parentId: parent_id,
      });
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Booking not exists" });
    }
    logger.info({
      message: "Updating payment status",
      bookingId: booking_id,
      parentId: parent_id,
    });
    await pool.query(
      `
      UPDATE cash_payments
      SET proof_photo = $1, payment_status = 'PAID', payment_date = NOW() WHERE booking_id = $2
    `,
      [proof_photo, booking_id],
    );
    await pool.query(
      `
      UPDATE bookings
      SET status = 'COMPLETED' WHERE id = $1
    `,
      [booking_id],
    );

    await pool.query("COMMIT");
    logger.info({
      message: "Payment completed successfully",
      bookingId: booking_id,
      parentId: parent_id,
    });
    return res.status(200).json({ message: "Payment successfully" });
  } catch (error) {
    logger.error({
      message: "Payment processing failed",
      bookingId: req.params.booking_id,
      parentId: req.user?.id,
      error: error.message,
      stack: error.stack,
    });
    await pool.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getPaymentHistory, payNow };
