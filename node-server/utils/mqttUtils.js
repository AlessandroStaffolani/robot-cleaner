/*
* =====================================
* uniboSupports/mqttUtils.js
* =====================================
*/
const mqtt = require('mqtt');
const config = require('../config/config');

const topic = config.mqttTopic;
const client = mqtt.connect(config.mqttUrl);

client.on('connect', function () {
    client.subscribe(topic);
    console.log('client mqtt has subscribed successfully ');
});

//The command usually arrives as buffer, so I had to convert it to string data type;
client.on('message', function (topic, message) {
    const payloadString = message.toString();
    if (payloadString.indexOf('constraint') !== -1) {

    }
    console.log("mqtt RECEIVES:" + message.toString()); //if toString is not given, the command comes as buffer
});

exports.publish = function (msg) {
    //console.log('mqtt publish ' + client);
    client.publish(topic, msg);
};

const getConstraintsValue = (message) => {
    let splitValues = message.split(',');
    let type = splitValues[4].replace('constraint(', '');
    let value = splitValues[5].replace(')', '');
    if (type === 'temp') {
        return {
            temperature: value + '°'
        }
    } else if (type === 'clock') {
        return {
            time: value
        }
    }
};