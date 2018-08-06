import sys
from src.ClientSocketIO import ClientSocketIO
from threading import Thread
from src.Lamp import Lamp
from subprocess import call

host = "localhost"
port = 5005


def start_node():
    call(['node', 'server/bin/server.js'])


def main(argv):
    
    if len(argv) > 1:
        if argv[1] == '--node-start':
            print("Starting node will cause problem on stop application, need to force to quit")
            node_thread = Thread(target=start_node)
            node_thread.start()
        else:
            println("Invalid argument:\npython3 philips-hue-lamp --node-start")
            exit(1)    
    client_socket = ClientSocketIO(host, port)
    client_socket.connect()

    # client_socket.emit('Ciao node')
    socket_thread = Thread(target=client_socket.wait)
    socket_thread.start()

    lamp = Lamp('Philips hue lamp', client_socket)

    lamp.mainloop()


if __name__ == '__main__':
    main(sys.argv)
