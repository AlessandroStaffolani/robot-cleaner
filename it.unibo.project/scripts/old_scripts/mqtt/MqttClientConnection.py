import paho.mqtt.client as mqtt # reference: https://pypi.org/project/paho-mqtt/
import time

topic = "unibo/qasys"

class MqttClientConnection:

    def __init__(self, id, broker_address, port, topic, transport="websockets"):
        self.id = id
        self.broker_address = broker_address
        self.port = port
        self.topic = topic
        self.transport = transport
        self.client_mqtt = None
    
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

    def on_publish(client,userdata,result):
        print("data published \n")

    def on_disconnect(client, userdata, flags):
        print("Disconnected succefully from broker...")
        client_mqtt.loop_stop()

    def on_subscribe(client, obj, mid, granted_qos):
        print("Subscribed: "+str(mid)+" "+str(granted_qos))
    

    def connect(self):
        self.client_mqtt = mqtt.Client(self.id,self.transport)
        self.client_mqtt.on_connect = self.on_connect
        self.client_mqtt.on_message = self.on_message
        self.client_mqtt.on_disconnect = self.on_disconnect
        self.client_mqtt.on_subscribe = self.on_subscribe
        self.client_mqtt.connect(self.broker_address, self.port)
        print(self.broker_address + ", port: " + str(self.port) + ", topic: ", self.topic)
        #self.client_mqtt.loop_start()
    
    def publish(self, msg):
        self.client_mqtt.publish(self.topic, msg)
    
    def loop_start(self):
        self.client_mqtt.loop_start()
    
    def loop_stop(self):
        self.client_mqtt.loop_stop()

        

   
