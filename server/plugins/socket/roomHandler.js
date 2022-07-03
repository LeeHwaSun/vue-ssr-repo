module.exports = (io, socket) => {
    socket.on('room:join', ( roomName ) => {
        socket.join(roomName);
    });

    socket.on('rooms:join', (arr) => {
        arr.forEach(room => {
            socket.join(room);
        });
    });

    socket.on('room:leave', ( roomName ) => {
        socket.leave(roomName);
    });

    socket.on('rooms:leave', (arr) => {
        arr.forEach(room => {
            socket.leave(room);
        });
    });
};