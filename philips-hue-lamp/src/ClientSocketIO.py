from socketIO_client import SocketIO, LoggingNamespace # reference here: https://pypi.org/project/socketIO-client3/


class ClientSocketIO:

    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.socket_client = None

    def connect(self):
        if self.socket_client is None:
            self.socket_client = SocketIO(self.host, self.port, LoggingNamespace)
            self.socket_client.on('connect', self.on_connect)
            self.socket_client.on('disconnect', self.on_disconnect)
            self.socket_client.on('reconnect', self.on_reconnect)
            self.socket_client.on('message', self.on_message_response)
            self.socket_client.on('close', self.close)

    def close(self):
        self.socket_client.disconnect()

    def on_connect(self):
        print('Connected to host = ' + self.host + ' port = ' + str(self.port))

    def on_disconnect(self):
        print('disconnect to host = ' + self.host + ' port = ' + str(self.port))

    def on_reconnect(self):
        print('reconnect to host = ' + self.host + ' port = ' + str(self.port))

    def add_new_event(self, event, callback):
        self.socket_client.on(event, callback)

    def on_message_response(self, *args):
        for item in args:
            print('message response', item)

    def on_value_response(self, value):
        print('Value = ', value)

    def on_color_response(self, color):
        print('Color = ', color)

    def emit(self, message):
        if self.socket_client is not None:
            print('Sending message: ', message)
            self.socket_client.emit('message', message)

    def emit_close(self):
        if self.socket_client is not None:
            self.socket_client.emit('close', True)

    def wait(self):
        self.socket_client.wait()
