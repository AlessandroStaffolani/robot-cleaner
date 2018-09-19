import time
import sys

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

TRIG = 24
ECHO = 25

GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)


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
    # print("Distance: ", distance, "cm")

    return int(round(distance))


def main(argv):
    print(calculate_distance())


if __name__ == '__main__':
    main(sys.argv)

