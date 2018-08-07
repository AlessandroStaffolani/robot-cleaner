import sys
from src.ClientSocketIO import ClientSocketIO
from threading import Thread
from src.Lamp import *
from subprocess import call
from src.led_gpio import on_value_response as gpio_on_value_response

host = "localhost"
port = 5005

start_node = False
led_gpio = False


def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('python3 philips-hue-lamp [options|None]', end='\n\n')
    print('-h | --help:\t to see this help message')
    print('--node-start:\t to automatically start node server '
          '(ATTENTION: will cause problem on stop application, need to force to quit')
    print('server-host [ip]:\t to set server host (default: localhost)')
    print('--led-gpio:\t to use raspberry phisic led using GPIO (default: is false and start mock led)')
    exit(1)


def reed_arguments(argv):
    argv_len = len(argv)
    global host
    global start_node
    global led_gpio
    error = False
    if argv_len > 1:
        if '-h' in argv or '--help' in argv:
            print_help()
        else:
            for i in range(1, argv_len):
                arg = argv[i]
                if '--node-start' == arg:
                    start_node = True
                elif '--led-gpio' == arg:
                    led_gpio = True
                if 'server-host' == arg:
                    if (argv_len-1) > i:
                        i = i + 1
                        host = argv[i]
                    else:
                        error = True

        return error

    else:
        return None


def start_node_action():
    call(['node', 'server/bin/server.js'])


def main(argv):

    arguments_result_error = reed_arguments(argv)
    if arguments_result_error is True:
        print_help()
    else:
        if start_node:
            print("Starting node will cause problem on stop application, need to force to quit")
            node_thread = Thread(target=start_node_action)
            node_thread.start()

        print("Waiting to connect to: " + host + " port: " + str(port))
        client_socket = ClientSocketIO(host, port)
        client_socket.connect()

        # client_socket.emit('Ciao node')
        socket_thread = Thread(target=client_socket.wait)
        socket_thread.start()

        if led_gpio:
            print("LED GPIO", end='\n\n')
            client_socket.add_new_event('value', gpio_on_value_response)
        else:
            print("LAMP VIRTUAL", end='\n\n')
            lamp = Lamp('Philips hue lamp', client_socket)
            lamp.mainloop()


if __name__ == '__main__':
    main(sys.argv)
