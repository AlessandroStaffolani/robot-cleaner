import sys
from src.ClientSocketIO import ClientSocketIO
import time
from src.Lamp import Lamp

host = "localhost"
port = 5005


def main(argv):
    lamp = Lamp('Philips hue lamp', host, port)
    # client_socket = ClientSocketIO(host, port)
    # client_socket.connect()
    # # client_socket.emit('Ciao node')
    # # lamp = Lamp('Philips hue lamp')
    # client_socket.wait()


if __name__ == '__main__':
    main(sys.argv)
