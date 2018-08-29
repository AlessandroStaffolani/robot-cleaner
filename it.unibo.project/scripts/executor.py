import RPi.GPIO as GPIO
import time
import sys

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


def move_forward():
    GPIO.output(FR,True)
    GPIO.output(FL,True)

def move_right():
    GPIO.output(FR,True)
    time.sleep(0.5)
    GPIO.output(FR,False)
    GPIO.cleanup()

def move_left():
    GPIO.output(FL,True)
    time.sleep(0.5)
    GPIO.output(FL,False)
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


if sys.argv[1] == "W" or sys.argv[1] == "w":
   move_forward()

elif sys.argv[1] == "S" or sys.argv[1] == "s":
    move_backward()

elif sys.argv[1] == "D" or sys.argv[1] == "d":
    move_right()

elif sys.argv[1] == "A" or sys.argv[1] == "a":
    move_left()

elif sys.argv[1] == "H" or sys.argv[1] == "h":
    stop()

elif sys.argv[1] == "P" or sys.argv[1] == "p":
    autopilot(30)
else:
    print("Not recognized command!")



