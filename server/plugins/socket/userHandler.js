module.exports = (io, socket) => {  
    socket.on("user:admUpdate", (data) => {
        io.to(data.user_id).emit('user:admUpdate', data);
    });
};