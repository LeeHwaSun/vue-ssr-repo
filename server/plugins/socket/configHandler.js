module.exports = (io, socket) => {  
    socket.on("config:update", (data) => {
        io.emit('config:update', data);
    });

    socket.on("config:remove", (data) => {
        io.emit('config:remove', data);
    });
};