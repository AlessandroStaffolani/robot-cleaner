from socketIO_client import SocketIO, LoggingNamespace # reference here: https://pypi.org/project/socketIO-client3/


class ClientSocketIO:

    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.socketClient = None

    def connect(self):
        if self.socketClient is None:
            self.socketClient = SocketIO(self.host, self.port, LoggingNamespace)
            self.socketClient.on('connect', self.on_connect)
            self.socketClient.on('disconnect', self.on_disconnect)
            self.socketClient.on('reconnect', self.on_reconnect)
            self.socketClient.on('message', self.on_message_response)
            self.socketClient.on('value', self.on_value_response)
            self.socketClient.on('color', self.on_color_response)

    def close(self):
        self.socketClient.disconnect()

    def on_connect(self):
        print('Connected to host = ' + self.host + ' port = ' + str(self.port))

    def on_disconnect(self):
        print('disconnect to host = ' + self.host + ' port = ' + str(self.port))

    def on_reconnect(self):
        print('reconnect to host = ' + self.host + ' port = ' + str(self.port))

    def on_message_response(self, *args):
        for item in args:
            print('message response', item)

    def on_value_response(self, value):
        print('Value = ', value)

    def on_color_response(self, color):
        print('Color = ', color)

    def emit(self, message):
        if self.socketClient is not None:
            print('Sending message: ', message)
            self.socketClient.emit('message', message)

    def wait(self, seconds=None):
        self.socketClient.wait(seconds=seconds)
