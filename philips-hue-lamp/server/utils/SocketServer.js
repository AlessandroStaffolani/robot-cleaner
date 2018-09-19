
let connectedClients = {};
let io = undefined;

const init = (server) => {
    if (!io) {
        io = require('socket.io')(server);

        io.on('connection', (socket) => {
            const code = socket.handshake.query.code;
            if (code !== undefined) {
                connectedClients[code] = socket;
                console.log("Client lamp with code = " + code + " connected");
                socket.on('message', data => console.log(data));
                socket.emit("message", "Message from node"); // for testing
                socket.on('close', () => {
                    socket.emit('close', true);
                })
            } else {
                console.log("Client lamp code missed");
                socket.disconnect();
            }
        });

        io.on('close', () => {
            console.log('Client disconnected');
        })
    }
};

const emitAll = (type, message) => {
    Object.keys(connectedClients).forEach(key => {
        connectedClients[key].emit(type, message);
    });
};

const emitToClient = (code, type, message) => {
    if (connectedClients[code]) {
        console.log("Emit on client lamp with code = " + code);
        console.log("Type = " + type);
        console.log("Message = " + message);
        connectedClients[code].emit(type, message);
    } else {
        console.log("Can\'t send message");
        console.log("Client with code = " + code + " not connected");
    }
};

module.exports = {
    init: init,
    emitAll: emitAll,
    emitToClient: emitToClient
};