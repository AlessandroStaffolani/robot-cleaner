
let connectedClient = undefined;
let io = undefined;

const init = (server) => {
    if (!io) {
        io = require('socket.io')(server);

        io.on('connection', (socket) => {
            connectedClient = socket;
            console.log("Client connected");
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

const emit = (type, message) => {
    connectedClient.emit(type, message);
};

module.exports = {
    init: init,
    emit: emit
};