const jwt = require("jsonwebtoken");

const authMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    console.log("token", token);

    if (!token) {
      return next(new Error("Unauthorized: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();
  } catch (err) {
    return next(new Error("Unauthorized: Invalid token"));
  }
};

module.exports = authMiddleware;
