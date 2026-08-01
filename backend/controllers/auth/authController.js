const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../../utils/dbConnection");
const {
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("../../common/sendEmail");
const { uploadFile } = require("../../middlewares/helper");

const registerUser = async (req, res) => {
  try {
    const { full_name, email, phone, password, role, branch_id, schoolName } =
      req.body;
    let profile_photo = "";
    console.log(req.files);
    console.log(req.body);
    if (req.files?.profile_photo?.[0]) {
      const uploaded = await uploadFile(
        req.files.profile_photo[0],
        `users/profile`
      );

      profile_photo = uploaded.url;
    }

    if (!full_name || !email || !phone || !password || !role)
      return res.status(400).json({ message: "Missing required fields" });

    const emailExists = await pool.query(
      "SELECT id,email FROM users WHERE LOWER(email)=LOWER($1)",
      [email],
    );

    if (emailExists.rows.length > 0) {
      console.log(
        "Email already exists:",
        emailExists.rows[0].id,
        emailExists.rows[0].email,
      );
      return res.status(409).json({
        message: "Email already registered",
        field: "email",
      });
    }

    const phoneExists = await pool.query(
      "SELECT id FROM users WHERE phone=$1",
      [phone],
    );

    if (phoneExists.rows.length > 0) {
      console.log("Phone already exists:", phone);
      return res.status(409).json({
        message: "Phone number already registered",
        field: "phone",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query("BEGIN");

    const user = await pool.query(
      `
      INSERT INTO users(full_name,email,phone,password,role,profile_photo,is_verified)
      VALUES ($1,$2,$3,$4,$5,COALESCE($6,''),false)
      RETURNING id
    `,
      [full_name, email, phone, hash, role, profile_photo],
    );

    const userId = user.rows[0].id;

    if (role === "DRIVER" && !branch_id) {
      return res.status(400).json({
        message: "School is required for drivers",
      });
    }

    if (role === "DRIVER") {

      let driver_license = "";
      let id_card = "";
      let vehicle_registration = "";
      let vehicle_photo = "";
      let number_plate = "";

      if (req.files?.driver_license?.[0]) {
        const uploaded = await uploadFile(
          req.files.driver_license[0],
          `users/driver_license`
        );

        driver_license = uploaded.url;
      }

      if (req.files?.id_card?.[0]) {
        const uploaded = await uploadFile(
          req.files.id_card[0],
          `users/id_card`
        );

        id_card = uploaded.url;
      }

      if (req.files?.vehicle_registration?.[0]) {
        const uploaded = await uploadFile(
          req.files.vehicle_registration[0],
          `users/vehicle_registration`
        );

        vehicle_registration = uploaded.url;
      }

      if (req.files?.vehicle_photo?.[0]) {
        const uploaded = await uploadFile(
          req.files.vehicle_photo[0],
          `users/vehicle_photo`
        );

        vehicle_photo = uploaded.url;
      }

      if (req.files?.number_plate?.[0]) {
        const uploaded = await uploadFile(
          req.files.number_plate[0],
          `users/number_plate`
        );

        number_plate = uploaded.url;
      }


      await pool.query(
        `
        INSERT INTO driver_documents(driver_id,driver_license,id_card,vehicle_docs,vehicle_photo,number_plate,is_verified)
        VALUES ($1,$2,$3,$4,$5,$6,false)
      `,
        [
          userId,
          driver_license,
          id_card,
          vehicle_registration,
          vehicle_photo,
          number_plate,
        ],
      );

      await pool.query(
        `
        INSERT INTO driver_approvals(driver_id,branch_id,status,created_at)
        VALUES ($1,$2,'PENDING',CURRENT_TIMESTAMP)
      `,
        [userId, branch_id],
      );
    }

    if (role === "GUARD" && branch_id) {
      await pool.query(
        `
        INSERT INTO school_guards(guard_id,branch_id,approval_status,created_at)
        VALUES ($1,$2,'PENDING',CURRENT_TIMESTAMP)
      `,
        [userId, branch_id],
      );
    }

    if (role === "SCHOOL") {
      await pool.query(
        `
        INSERT INTO schools(owner_user_id,school_name,is_active,service_active)
        VALUES ($1,$2,$3,$4)
      `,
        [userId, schoolName, true, true],
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(
      `
      INSERT INTO users_otp(user_id,otp,expires_at)
      VALUES($1,$2,NOW() + interval '5 minutes')
    `,
      [userId, otp],
    );

    await pool.query("COMMIT");

    // try {
    //   await sendOtpEmail(email, otp, full_name);
    // } catch (emailError) {
    //   console.error("Failed to send OTP email:", emailError);
    // }

    res.status(201).json({ message: "Registered. Verify OTP." });
  } catch (err) {
    console.log(err);
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;
  logger.info({
    message: "User login request received",
    email,
    phone,
    route: req.originalUrl,
    method: req.method,
  });

  try {
    // console.log({ email, phone, password });
    logger.info({
      message: "Fetching user from database",
      email,
    });
    await pool.query("BEGIN");
    const u = await pool.query(
      `
    SELECT u.id,u.full_name,u.email,u.phone,u.password,u.is_verified,u.role,da.status
    FROM users u LEFT JOIN driver_approvals da ON u.id=da.driver_id WHERE email=$1
  `,
      [email],
    );

    if (!u.rowCount) {
      logger.warn({
        message: "Login failed - user not found",
        email,
      });
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = u.rows[0];
    logger.info({
      message: "User found",
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const driverApproval = await pool.query(
      "SELECT status FROM driver_approvals WHERE driver_id=$1",
      [user.id],
    );

    if (!user.is_verified) {
      logger.warn({
        message: "Login denied - account not verified",
        userId: user.id,
        email: user.email,
      });
      return res.status(403).json({ message: "Verify OTP first" });
    }
    if (
      user.role === "DRIVER" &&
      driverApproval.rows[0]?.status !== "APPROVED"
    ) {
      logger.warn({
        message: "Driver login denied - approval pending",
        userId: user.id,
        email: user.email,
        approvalStatus: driverApproval.rows[0]?.status,
      });
      await pool.query("ROLLBACK");
      return res.status(403).json({
        message:
          "Police record verification is in progress. Please try again later.",
      });
    }

    const sg = await pool.query(
      "SELECT exists (SELECT 1 FROM school_guards WHERE guard_id=$1 AND approval_status='APPROVED')",
      [user.id],
    );
    if (!sg.rows[0].exists && user.role === "GUARD") {
      logger.warn({
        message: "Guard login denied - approval pending",
        userId: user.id,
        email: user.email,
      });
      await pool.query("ROLLBACK");
      return res.status(403).json({
        message:
          "Guard not approved please wait for approval by school authority",
      });
    }
    logger.info({
      message: "Verifying user password",
      userId: user.id,
    });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logger.warn({
        message: "Login failed - incorrect password",
        userId: user.id,
        email: user.email,
      });
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Email or password incorrect" });
    }
    logger.info({
      message: "Generating JWT token",
      userId: user.id,
      role: user.role,
    });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1d" },
    );

    // try {
    //   await sendWelcomeEmail(email, user.full_name, user.role);
    // } catch (emailError) {
    //   console.error("Failed to send welcome email:", emailError);
    // }
    logger.info({
      message: "Updating last login timestamp",
      userId: user.id,
    });

    await pool.query("COMMIT");
    await pool.query(`UPDATE users SET last_login=NOW() WHERE id=$1`, [
      user.id,
    ]);
    logger.info({
      message: "User logged in successfully",
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return res
      .status(200)
      .json({ message: "Login successful", role: user.role, token });
  } catch (error) {
    logger.error({
      message: "Login process failed",
      email,
      error: error.message,
      stack: error.stack,
    });
    await pool.query("ROLLBACK");
    return res.status(500).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;

  logger.info({
    message: "OTP verification request received",
    email,
    phone,
    route: req.originalUrl,
    method: req.method,
  });

  try {
    await pool.query("BEGIN");
    logger.info({
      message: "Verifying OTP for user",
      email,
    });

    const r = await pool.query(
      `
    SELECT u.id FROM users u
    JOIN users_otp o ON o.user_id=u.id
    WHERE u.email=$1 AND o.otp=$2 AND o.status='PENDING' AND o.expires_at>NOW()
  `,
      [email, otp],
    );

    if (!r.rowCount) {
      logger.warn({
        message: "OTP verification failed - Invalid or expired OTP",
        email,
      });
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const userId = r.rows[0].id;

    logger.info({
      message: "OTP validated successfully",
      userId,
      email,
    });
    await pool.query("UPDATE users SET is_verified=true WHERE id=$1", [
      r.rows[0].id,
    ]);
    logger.info({
      message: "User account marked as verified",
      userId,
    });
    await pool.query(
      "UPDATE users_otp SET status='VERIFIED', otp='' WHERE user_id=$1",
      [r.rows[0].id],
    );
    logger.info({
      message: "OTP record updated",
      userId,
    });
    await pool.query("COMMIT");
    logger.info({
      message: "OTP verification completed successfully",
      userId,
      email,
    });
    return res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    logger.error({
      message: "OTP verification failed due to server error",
      email,
      error: error.message,
      stack: error.stack,
    });
    await pool.query("ROLLBACK");
    return res.status(500).json({ error: error.message });
  }
};

const resendOtp = async (req, res) => {
  const { email, phone } = req.body;
  try {
    const r = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (!r.rowCount) return res.status(400).json({ message: "User not found" });
    const userId = r.rows[0].id;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(
      `
      INSERT INTO users_otp(user_id,otp,expires_at)
      VALUES($1,$2,NOW() + interval '5 minutes')
    `,
      [userId, otp],
    );

    try {
      const user = await pool.query(
        "SELECT full_name, email FROM users WHERE id=$1",
        [userId],
      );
      if (user.rowCount) {
        await sendOtpEmail(user.rows[0].email, otp, user.rows[0].full_name);
      }
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
    }

    return res.status(200).json({ message: "OTP resent" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const r = await pool.query(
      "SELECT id, full_name FROM users WHERE email=$1",
      [email],
    );
    if (!r.rowCount) return res.status(400).json({ message: "User not found" });
    const userId = r.rows[0].id;
    const fullName = r.rows[0].full_name;
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // await pool.query(
    //   `
    //   INSERT INTO users_otp(user_id,otp,expires_at)
    //   VALUES($1,$2,NOW() + interval '15 minutes')
    // `,
    //   [userId, otp]
    // );
    try {
      // await sendOtpEmail(email, otp, fullName);
      await sendPasswordResetEmail(email, fullName);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
    }
    res.status(200).json({
      message: "Check your email, link sent for password reset on your email.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const r = await pool.query(
      `
    SELECT id FROM users WHERE email=$1`,
      [email],
    );
    if (!r.rowCount) return res.status(404).json({ message: "User not found" });
    const userId = r.rows[0].id;
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
      hash,
      userId,
    ]);
    // await pool.query(
    //   "UPDATE users_otp SET status='VERIFIED', otp='' WHERE user_id=$1",
    //   [userId]
    // );
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
};
