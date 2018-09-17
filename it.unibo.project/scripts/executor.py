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

def print_help():
    print('--- FuffaTeam ---', end='\n\n')
    print('python3 executor_with_sonar.py [move] [time]', end='\n\n')
    print('-h | --help:\t to see this help message\n')
    print('[move]: W[w], A[a], S[s], D[d], H[h]\n')
    print('[time]:\t time in sec (optional) [-1] infinite\n')
  

def move_forward(mv_time):
    GPIO.output(FL,True)
    GPIO.output(FR,True)
    if mv_time != -1:
        time.sleep(mv_time)
        GPIO.output(FL,False)
        GPIO.output(FR,False) 

def move_right():
    channel_f_r = GPIO.input(FR)
    channel_f_l = GPIO.input(FL)
    
    if channel_f_r == True or channel_f_l == True:
        GPIO.output(FR,False)
        GPIO.output(FL,False)
    
    time.sleep(0.3)    
    GPIO.output(FR,True)
    time.sleep(0.68)
    GPIO.output(FR,False)
    GPIO.cleanup()

def move_left():
    channel_f_r = GPIO.input(FR)
    channel_f_l = GPIO.input(FL)

    if channel_f_r == True or channel_f_l == True:
        GPIO.output(FR,False)
        GPIO.output(FL,False)

    time.sleep(0.3)
    GPIO.output(BR,True)
    time.sleep(0.7)
    GPIO.output(BR,False)
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
    

def main(argv):

    print("Fuffolo is starting..")
    if sys.argv[1] == "W" or sys.argv[1] == "w":
        if len(sys.argv) != 3:
            print_help()
        else:
            move_forward(float(sys.argv[2]))

    elif sys.argv[1] == "S" or sys.argv[1] == "s":
        move_backward()

    elif sys.argv[1] == "D" or sys.argv[1] == "d":
        move_right()

    elif sys.argv[1] == "A" or sys.argv[1] == "a":
        move_left()

    elif sys.argv[1] == "H" or sys.argv[1] == "h":
        stop()

    else:
        print_help()

if __name__ == '__main__':
    main(sys.argv)


