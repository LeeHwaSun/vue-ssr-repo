const { Server } = require("socket.io");
const configHandler = require("./configHandler");

module.exports = function(webServer) {
    const io = new Server(webServer);

    io.on("connection", (socket) => {
        configHandler(io, socket);

        console.log('a user connected ' + socket.id);

        socket.on("disconnect", () => {
            console.log('disconnect user')
        });

        socket.on('room:join', ( roomName ) => {
            console.log("room:join ", roomName);
            socket.join(roomName);
        });

        socket.on('room:leave', ( roomName ) => {
            console.log("room:leave ", roomName);
            socket.leave(roomName);
        });

        socket.on('room:send', ( data ) => {
            console.log('room:send ', data);
            const msg = data.msg + " 서버 응답";
            //io.emit('room:msg', { msg });
            //socket.broadcast.emit('room:msg', { msg });
            io.to('roomtest').emit('room:msg', { msg });
            //socket.to('roomtest').emit('room:msg', { msg });
        });
    });
};