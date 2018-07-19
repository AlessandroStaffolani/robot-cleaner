/*
* =====================================
* uniboSupports/mqttUtils.js
* =====================================
*/
const mqtt = require('mqtt');
const topic = "unibo/qasys";
//var client = mqtt.connect('mqtt://iot.eclipse.org');
let client = mqtt.connect('ws://localhost:1884');
//var client   = mqtt.connect('tcp://192.168.43.229:1883');

client.on('connect', function () {
    client.subscribe(topic);
    console.log('client mqtt has subscribed successfully ');
});

//The command usually arrives as buffer, so I had to convert it to string data type;
client.on('message', function (topic, message) {
    console.log("mqtt RECEIVES:" + message.toString()); //if toString is not given, the command comes as buffer
});

exports.publish = function (msg) {
    //console.log('mqtt publish ' + client);
    client.publish(topic, msg);
};