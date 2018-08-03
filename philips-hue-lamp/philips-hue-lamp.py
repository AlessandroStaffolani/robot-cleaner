import sys
from src.SocketClient import SocketClient
from src.Lamp import Lamp

host = "localhost"
port = 5005


def main(argv):
    client = SocketClient()
    client.connect(host, port)
    print("Connessione avvenuta con successo!")
    print(client.receive())


if __name__ == '__main__':
    main(sys.argv)
