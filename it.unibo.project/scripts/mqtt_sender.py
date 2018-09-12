import paho.mqtt.client as mqtt
import sys


def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('IMPORTANT: All params must be specified!')
    print('python3 obstacle_detector.py [mqttbroker] [mqttport] [mqtttopic] [message]', end='\n\n')
    print('-h | --help:\t to see this help message\n')
    print('[mqttbroker]:\t ip address mqtt broker\n')

    exit(1)


def main(argv):
    if len(argv) < 5:
        print_help()
        exit(-1)

    if sys.argv[1] == "-h":
        print_help()

    broker_address = argv[1]
    broker_port = int(argv[2])
    topic = argv[3]
    message = argv[4]

    client = mqtt.Client(client_id="pi", transport="websockets")

    client.connect(broker_address, broker_port)
    client.loop_start()

    client.publish(topic, message)

    client.loop_stop()


if __name__ == '__main__':
    main(sys.argv)