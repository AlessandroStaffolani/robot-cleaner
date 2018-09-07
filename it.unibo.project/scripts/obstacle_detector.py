# Questo script ha il compito di segnalare alla mind, tramite mqtt, ogni qual volta 
# il robot si trova vicino ad un ostacolo, in modo tale che la mind possa bloccare il robot
# in movimento.
# Verrà lanciato all'inizializzazione del qactor relativo al real robot
# Appena il robot sarà attivo verrà eseguito come ciclo infinito
# Importante che questo script venga lanciato in background

import RPi.GPIO as GPIO
import time
import sys
import paho.mqtt.client as mqtt

GPIO.setmode(GPIO.BCM)

TRIG = 24
ECHO = 25

topic = "unibo/qasys"


def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('IMPORTANT: All params must be specified!')
    print('python3 obstacle_detector.py [mqttbroker]', end='\n\n')
    print('-h | --help:\t to see this help message\n')
    print('[mqttbroker]:\t ip address mqtt broker\n')
  
    exit(1)


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected successufully")
    # topic = "unibo/qasys"
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    print("Subscribing to the topic: " + topic)
    client.subscribe(topic)


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))


def on_disconnect(client, userdata, flags):
    print("Disconnected succefully from broker...")

def calculate_distance():
    GPIO.output(TRIG,True)
    time.sleep(0.00001)
    GPIO.output(TRIG,False)
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()

    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance,2)
    print("Distance: ", distance, "cm")

    return distance




def main(argv):

    if len(argv) < 2:
        print_help()
        exit(-1)

     if sys.argv[1] == "-h":
        print_help()
    
    # Recupero dell'address del broker
    broker_address = argv[2]
    print("Try to connect to the broker:  " + broker_address)
    
    # Inizializzazione del client
    client = mqtt.Client(client_id="pi",transport="websockets")
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    # Connessione al broker
    client.connect(broker_address, 1884)

    # Per poter accedere alle callback il client deve entrare in
    # un loop di attesa. Esce dal loop quando ha terminato (guarda funzioni).
    client.loop_forever()

    # Settaggio sonar del robot
    GPIO.output(TRIG, False)
    print("Waiting For Sensor To Settle..")
    time.sleep(2)
    print("Sensor ready!")

    # Da implementare 
    #while(true):

if __name__ == '__main__':
    main(sys.argv)
