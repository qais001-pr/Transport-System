const authMiddleware = require("./authMiddleware");
const driverModule = require("./modules/driver/driverModule");
const guardModule = require("./modules/guard/guardModule");
const notificationModule = require("./modules/notifications/notificationModule");
const parentModule = require("./modules/parent/parentModule");

const setupSocket = (io) => {
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    const role = socket.user.role;
    console.log("User Connected:", socket.user.id);

    if (role === "DRIVER") {
      driverModule(socket, io);
    }

    if (role === "GUARD") {
      guardModule(socket, io);
    }

    if (role === "PARENT") {
      parentModule(socket, io);
    }

    notificationModule(socket, io);

    socket.on("join-van-room", (vanId) => {
      socket.join(`van-${vanId}`);
      console.log(`joined van-${vanId}`);
    });

    socket.on("leave-van-room", (vanId) => {
      socket.leave(`van-${vanId}`);
      console.log(`left van-${vanId}`);
    });

    socket.on("route-status", ({ vanStatus, vanId }) => {
      console.log({ vanStatus, vanId });
      socket.to(`van-${vanId}`).emit("route-status", {
        vanId: vanId,
        vanStatus: vanStatus,
      });
    });
  });
};

module.exports = setupSocket;
