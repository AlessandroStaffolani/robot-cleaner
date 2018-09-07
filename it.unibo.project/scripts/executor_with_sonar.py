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

topic = "unibo/qasys"


def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('IMPORTANT: All params must be specified!')
    print('python3 executor_with_sonar.py [move] [mqttbroker]', end='\n\n')
    print('-h | --help:\t to see this help message\n')
    print('[move]: W[w], A[a], S[s], D[d], H[h]\n')
    print('[mqttbroker]:\t ip address mqtt broker\n')
  
    exit(1)

def move_forward(client):
    distance = calculate_distance()
    
    if distance <= 10:
        # emettere messaggio su mqtt
        # Avviso la mind che non posso andare avanti
        client.publish(topic, 'msg(realSonarDetect,event,js,pi,realSonarDetect(distance('+ str(distance)+ ')),1)')
    else:
        GPIO.output(FL,True)
        GPIO.output(FR,True)
    
    client.loop_stop()

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
       client.publish(topic, 'msg(realSonarDetect,event,js,pi,realSonarDetect(distance('+ str(distance)+ ')),1)')
    
    GPIO.cleanup()
    client.loop_stop()

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

    time.sleep(0.5)
    #Verifico la distanza dall'ostacolo
    distance = calculate_distance()
    if distance <= 10:
        # emettere messaggio su mqtt
        # Avviso la mind che da questo lato non c'è spazio per muoversi
        client.publish(topic, 'msg(realSonarDetect,event,js,pi,realSonarDetect(distance('+ str(distance)+ ')),1)')
        
    GPIO.cleanup()
    client.loop_stop()

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
    print("Connected successufully")
    # topic = "unibo/qasys"
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    print("Subscribing to the topic: " + topic)
    client.subscribe(topic)

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

    if len(argv) < 3:
        print_help()
        exit(-1)
    
    if sys.argv[1] == "-h":
        print_help()
    
    # Settaggio sonar del robot
    GPIO.output(TRIG, False)
    print("Waiting For Sensor To Settle..")
    time.sleep(2)
    print("Sensor ready!")

    # Recupero dell'address del broker
    broker_address = argv[2]
    print("Try to connect to the broker:  " + broker_address)
    
    # Inizializzazione del client
    client = mqtt.Client(client_id="pi",transport="websockets")
    client.on_connect = on_connect
    client.on_message = on_message

    # Connessione al broker
    client.connect(broker_address, 1884)

    # Per poter accedere alle callback il client deve entrare in
    # un loop di attesa. Esce dal loop quando ha terminato (guarda funzioni).
    client.loop_start()

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
    
    else:
        print_help()


if __name__ == '__main__':
    main(sys.argv)


