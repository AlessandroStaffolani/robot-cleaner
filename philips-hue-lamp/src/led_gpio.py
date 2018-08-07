#import RPi.GPIO as GPIO

#LED = 8
#GPIO.setmode(GPIO.BCM)
#GPIO.setwarnings(False)
#GPIO.setup(LED, GPIO.OUT)


def led_on():
    print("Led is ON")
    #GPIO.output(LED,True)


def led_off():
    print("Led is OFF")
    #GPIO.output(LED,False)


def on_value_response(value):
    if value == True:
        led_on()
    elif value == False:
        led_off()
