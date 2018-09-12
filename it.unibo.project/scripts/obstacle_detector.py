import time
import sys
import paho.mqtt.client as mqtt
from threading import Thread
import RPi.GPIO as GPIO
import random

GPIO.setmode(GPIO.BCM)

TRIG = 24
ECHO = 25

GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

topic = "unibo/qasys"

global_distance = 100
stop_distance_calculation = False


def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('IMPORTANT: All params must be specified!')
    print('python3 obstacle_detector.py [mqttbroker]', end='\n\n')
    print('-h | --help:\t to see this help message\n')
    print('[mqttbroker]:\t ip address mqtt broker\n')

    exit(1)


def calculate_distance():
    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output(TRIG, False)
    pulse_start = 0
    pulse_end = 0
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()

    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)
    int_distance = int(round(distance))
    print("Distance: ", int_distance, "cm")

    return int_distance

def random_distance():
    distance = random.randint(5, 150)
    print("Random distance: ", distance, "cm")
    return distance


def external_distance():
    global distance_global
    distance_global = 100
    while stop_distance_calculation is False:
        distance_global = random_distance()
        time.sleep(0.5)


def on_connect(client, userdata, flags, rc):
    print("Connected")
    # client.subscribe(topic)


def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))


def on_disconnect(client, userdata, flags):
    print("Disconnected succefully from broker...")


def on_publish(client,userdata,result):
    print("data published \n")


def main(argv):

    if len(argv) < 2:
        print_help()
        exit(-1)

    if sys.argv[1] == "-h":
        print_help()

    # Settaggio sonar del robot
    GPIO.output(TRIG, False)
    print("Waiting For Sensor To Settle..")
    time.sleep(2)
    print("Sensor ready!")

    broker_address = argv[1]
    print("Try to connect to the broker:  " + broker_address)
    
    # connecting to mqtt
    client = mqtt.Client(client_id="pi", transport="websockets")
    client.max_inflight_messages_set(200)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_publish = on_publish
    client.on_disconnect = on_disconnect

    client.connect(broker_address, 1884)

    mqtt_thread = Thread(target=client.loop_forever)
    mqtt_thread.start()

    try:
        while True:
            distance = calculate_distance()
            if distance <= 30:
                msg = 'msg(realSonarDetect,event,real_robot,mindrobot,realSonarDetect(sonarReal,' + str(distance) + '),1)'
                Thread(target=(lambda topic, msg: client.publish(topic, msg)), args=(topic, msg)).start()
                # Thread(target=test, kwargs=({'topic': topic, 'payload': msg})).start()
                # client.publish(topic, 'msg(realSonarDetect,event,real_robot,mindrobot,realSonarDetect(sonarReal,' + str(distance) + '),1)')
                # GPIO.cleanup()
                # GPIO.setmode(GPIO.BCM)
                # GPIO.setup(TRIG, GPIO.OUT)
                # GPIO.setup(ECHO, GPIO.IN)
                # GPIO.output(TRIG, False)

            time.sleep(0.5)

    except KeyboardInterrupt:
        print('\n\rkeyboard interrupt')
        client.disconnect()
        GPIO.cleanup()
        exit(0)


if __name__ == '__main__':
    main(sys.argv)

