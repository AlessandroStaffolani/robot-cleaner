import RPi.GPIO as GPIO
import time
import sys
import paho.mqtt.client as mqtt

GPIO.setmode(GPIO.BCM)

BL = 14
FL = 15
FR = 18
BR = 23
TRIG = 24
ECHO = 25

GPIO.setwarnings(False)
GPIO.setup(FR, GPIO.OUT)
GPIO.setup(FL, GPIO.OUT)
GPIO.setup(BL, GPIO.OUT)
GPIO.setup(BR, GPIO.OUT)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

GPIO.output(TRIG, False)
print("Waiting For Sensor To Settle..")
time.sleep(2)
print("Sensor ready!")


def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('IMPORTANT: All params must be specified!')
    print('python3 executor_with_sonar.py [move] [mqttserver]', end='\n\n')
    print('-h | --help:\t to see this help message\n')
    print('[move]: W[w], A[a], S[s], D[d], H[h]\n')
    print('[mqttserver]:\t ip address mqtt server\n')
  
    exit(1)

def move_forward(client):
    distance = calculate_distance()
    if distance <= 10:
        # emettere messaggio su mqtt
        # Avviso la mind che non posso andare avanti

    else:
        GPIO.output(FL,True)
        GPIO.output(FR,True)

def move_right(client):
    channel_f_r = GPIO.input(FR)
    channel_f_l = GPIO.input(FL)
    
    # Se il robot è in movimento mi fermo e dopo mi giro
    if channel_f_r == True or channel_f_l == True:
        GPIO.output(FR,False)
        GPIO.output(FL,False)

    time.sleep(0.3)    
    GPIO.output(FR,True)
    time.sleep(0.8)
    GPIO.output(FR,False)
    
    distance = calculate_distance()
    if distance <= 10:
        # emettere messaggio su mqtt
        # Avviso la mind che da questo lato non c'è spazio per muoversi
    
    GPIO.cleanup()

def move_left(client):
    channel_f_r = GPIO.input(FR)
    channel_f_l = GPIO.input(FL)

    # Se il robot è in movimento mi fermo e dopo mi giro
    if channel_f_r == True or channel_f_l == True:
        GPIO.output(FR,False)
        GPIO.output(FL,False)

    time.sleep(0.3)
    GPIO.output(FL,True)
    time.sleep(0.6)
    GPIO.output(FL,False)

    #Verifico la distanza dall'ostacolo
    distance = calculate_distance()
    if distance <= 10:
        # emettere messaggio su mqtt
        # Avviso la mind che da questo lato non c'è spazio per muoversi

    GPIO.cleanup()

def move_backward():
    GPIO.output(BL,True)
    GPIO.output(BR,True)

def stop():
    GPIO.output(FR,False)
    GPIO.output(FL,False)
    GPIO.output(BL,False)
    GPIO.output(BR,False)
    GPIO.cleanup()

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

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))


    
# DA DEFINIRE!!
# Ogni qualvolta verrà trovato un ostacolo dovrà inviare un messaggio su mqtt
# in modo tale che la mind possa gestire l'occcorrenza di quest'ultimo e stabilire
# cosa il real robot debba fare (fare nell'ultima fase).
# def autopilot(seconds):
	# Inizializzazione del sensore
#	GPIO.output(TRIG, False)
#	print("Waiting For Sensor To Settle..")
#	time.sleep(2)
#	print("Sensor ready!")
	# --------------------------
	
#    start_time = time.time()
#    move_forward()
#    end_time = 0
#    while (end_time - start_time) < seconds:
#        distance = calculate_distance()
#        if distance <= 10:
#            print("Obstacle detected")
#            stop()
#        end_time = time.time()
#    stop()
#    GPIO.cleanup()

def main(argv):

    if argv.length < 3:
        print_help()
        exit(-1)
    server_address = argv[2]
    print("Try to connect to " + server_address)
    connect(server_address)

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(server_address, 1884, 60)
    client.subscribe('unibo/qasys')
    client.loop_forever()

    if argv[1] == "W" or argv[1] == "w":
    move_forward(client)

    elif sys.argv[1] == "S" or sys.argv[1] == "s":
        move_backward()

    elif sys.argv[1] == "D" or sys.argv[1] == "d":
        move_right(client)

    elif sys.argv[1] == "A" or sys.argv[1] == "a":
        move_left(client)

    elif sys.argv[1] == "H" or sys.argv[1] == "h":
        stop()

    # elif sys.argv[1] == "P" or sys.argv[1] == "p":
    #     autopilot(30)
    elif sys.argv[1] == "-h":
        print_help()

    else:
        print_help()


if __name__ == '__main__':
    main(sys.argv)


