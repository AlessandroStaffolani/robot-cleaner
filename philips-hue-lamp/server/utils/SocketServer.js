
let connectedClients = {};
let io = undefined;

const init = (server) => {
    if (!io) {
        io = require('socket.io')(server);

        io.on('connection', (socket) => {
            connectedClients[socket.id] = socket;
            console.log("Client " + socket.id + " connected");
            socket.on('message', data => console.log(data));
            socket.emit("message", "Message from node"); // for testing
            socket.on('close', () => {
                socket.emit('close', true);
            })
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

module.exports = {
    init: init,
    emitAll: emitAll
};