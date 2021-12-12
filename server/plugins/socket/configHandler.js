module.exports = (io, socket) => {  
    socket.on("config:update", (data) => {
        console.log('update :', data);
        io.emit('config:update', data);
    });

    socket.on("config:remove", (data) => {
        console.log('remove :', data);
        io.emit('config:remove', data);
    });
};