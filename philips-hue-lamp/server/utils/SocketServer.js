
let connectedClient = undefined;
let io = undefined;

const init = (server) => {
    if (!io) {
        io = require('socket.io')(server);

        io.on('connection', (socket) => {
            connectedClient = socket;
            console.log("Client connected");
            socket.on('message', data => console.log(data));
            socket.emit("Ciao", "python 3");
        });

        io.on('close', () => {
            console.log('Client disconnected');
        })
    }
};

const emit = (type, value) => {
    connectedClient.emit(type, {
        value: value
    });
};

module.exports = {
    init: init,
    emit: emit
};