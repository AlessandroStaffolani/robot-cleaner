

def led_on():
    print("Led is ON")


def led_off():
    print("Led is OFF")


def on_value_response(value):
    if value == True:
        led_on()
    elif value == False:
        led_off()
