module.exports = socketConfig = (io) => {
  io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected..`);

    socket.on("join_chat", ({ room_id }) => {
      socket.join(room_id);
    });
    socket.on("client_pkg", (pkgData) => {
      console.log(pkgData);
      socket.to(pkgData.room_id).emit("server_pkg", pkgData);
    });
    socket.on("exit_chat", () => {
      socket.disconnect();
    });
    socket.on("disconnect", () => {
      console.log(`user ${socket.id} disconnected..`);
    });
  });
};
