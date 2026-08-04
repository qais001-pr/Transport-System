const { pool } = require("../../utils/dbConnection");
const logger = require('../../middlewares/loki')
const getBookings = async (req, res) => {
  try {
    const parentId = req.user.id;
    logger.info({
      message: "Parent bookings request received",
      parentId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching parent bookings from database",
      parentId,
    });
    const bookings = await pool.query(
      `
      SELECT 
        b.id,
        b.status,
        b.booked_at,
        c.full_name AS child_name,
        c.id AS child_id,
        c.parent_id,
        v.id AS van_id,
        v.number_plate,
        v.fare,
        u.id AS driver_id,
        u.full_name AS driver_name,
        s.school_name AS van_address,
        sb.start_time-Interval '30 minutes' as pick_up_time,
        sb.end_time as drop_off_time,
        c.pickup_address,
        p.payment_status
      FROM bookings b
      JOIN cash_payments p ON p.booking_id = b.id
      JOIN children c ON c.id = b.child_id
      JOIN vans v ON v.id = b.van_id
      JOIN school_branches sb ON sb.id = c.branch_id
      JOIN schools s ON s.id = sb.school_id
      LEFT JOIN users u ON u.id = v.driver_id
      WHERE c.parent_id = $1
      ORDER BY b.booked_at DESC
    `,
      [parentId],
    );

    logger.info({
      message: "Parent bookings fetched successfully",
      parentId,
      totalBookings: bookings.rowCount,
    });

    res.json({ bookings: bookings.rows });
  } catch (err) {
    logger.error({
      message: "Failed to fetch parent bookings",
      parentId: req.user?.id,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { bookingId } = req.params;
    logger.info({
      message: "Booking details request received",
      parentId,
      bookingId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Fetching booking details from database",
      parentId,
      bookingId,
    });
    const booking = await pool.query(
      `
      SELECT 
        b.id,
        b.status,
        b.booked_at,
        c.full_name AS child_name,
        v.number_plate,
        v.fare,
        u.full_name AS driver_name
      FROM bookings b
      JOIN children c ON c.id = b.child_id
      JOIN vans v ON v.id = b.van_id
      LEFT JOIN users u ON u.id = v.driver_id
      WHERE b.id=$1 AND c.parent_id=$2
    `,
      [bookingId, parentId],
    );

    if (!booking.rowCount) {
      logger.warn({
        message: "Booking not found",
        parentId,
        bookingId,
      });
      return res.status(404).json({ message: "Booking not found" });
    }
    logger.info({
      message: "Booking details fetched successfully",
      parentId,
      bookingId,
      bookingStatus: booking.rows[0].status,
    });
    res.json({ booking: booking.rows[0] });
  } catch (err) {
    logger.error({
      message: "Failed to fetch booking details",
      parentId: req.user?.id,
      bookingId: req.params.bookingId,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { bookingId } = req.params;

    logger.info({
      message: "Booking cancellation request received",
      parentId,
      bookingId,
      route: req.originalUrl,
      method: req.method,
    });

    logger.info({
      message: "Cancelling booking",
      parentId,
      bookingId,
    });

    const ok = await pool.query(
      `
      UPDATE bookings b
      SET status='CANCELLED'
      FROM children c
      WHERE b.child_id=c.id AND c.parent_id=$1 AND b.id=$2
      RETURNING b.id
    `,
      [parentId, bookingId],
    );

    if (!ok.rowCount) {
      logger.warn({
        message: "Booking not found",
        parentId,
        bookingId,
      });
      return res.status(404).json({ message: "Booking not found" });
    }
    logger.info({
      message: "Booking cancelled successfully",
      parentId,
      bookingId,
    });
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    logger.error({
      message: "Failed to cancel booking",
      parentId: req.user?.id,
      bookingId: req.params.bookingId,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

const reBooking = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { bookingId } = req.params;


    logger.info({
      message: "Rebooking request received",
      parentId,
      bookingId,
      route: req.originalUrl,
      method: req.method,
    });

    await pool.query("BEGIN");

    logger.info({
      message: "Fetching existing booking",
      parentId,
      bookingId,
    });

    await pool.query("BEGIN");

    logger.info({
      message: "Fetching existing booking",
      parentId,
      bookingId,
    });


    const old = await pool.query(
      `
      SELECT b.child_id, b.van_id
      FROM bookings b
      JOIN children c ON c.id=b.child_id
      WHERE b.id=$1 AND c.parent_id=$2
    `,
      [bookingId, parentId],
    );

    if (!old.rowCount) {
      await pool.query("ROLLBACK");
      logger.warn({
        message: "Booking not found",
        parentId,
        bookingId,
      });

      return res.status(404).json({ message: "Booking not found" });
    }
    logger.info({
      message: "Updating booking status to ACTIVE",
      parentId,
      bookingId,
    });
    const n = await pool.query(
      `
      UPDATE bookings b
      SET status='ACTIVE'
      FROM children c
      WHERE b.child_id=c.id AND c.parent_id=$1 AND b.id=$2
      RETURNING b.id
    `,
      [parentId, bookingId],
    );
    logger.info({
      message: "Booking reactivated successfully",
      parentId,
      bookingId: n.rows[0].id,
    });

    res.status(201).json({ message: "Rebooked", booking: n.rows[0] });
  } catch (err) {
    await pool.query("ROLLBACK");
    logger.error({
      message: "Failed to rebook booking",
      parentId: req.user?.id,
      bookingId: req.params.bookingId,
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBookings,
  getBookingDetails,
  cancelBooking,
  reBooking,
};
