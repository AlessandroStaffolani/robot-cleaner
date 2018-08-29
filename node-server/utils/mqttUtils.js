/*
* =====================================
* uniboSupports/mqttUtils.js
* =====================================
*/
const mqtt = require('mqtt');
const config = require('../config/config');
const resourceModelActions = require('../model/resourceModelActions');
const Sensor = require('../model/sensor');

const topic = config.mqttTopic;
const client = mqtt.connect(config.mqttUrl);

client.on('connect', function () {
    client.subscribe(topic);
    console.log('client mqtt has subscribed successfully ');
});

//The command usually arrives as buffer, so I had to convert it to string data type;
client.on('message', function (topic, message) {
    const payloadString = message.toString();
    if (payloadString.indexOf('resourceChangeEvent') !== -1) {
        let payloadData = getConstraintsValue(payloadString);
        resourceModelActions.update_resource(payloadData.type, payloadData.name, {
            value: payloadData.value
        })
            .then(objectUpdated => console.log(objectUpdated))
            .catch(err => console.log(err));
    }
    console.log("mqtt RECEIVES:" + message.toString()); //if toString is not given, the command comes as buffer
});

exports.publish = function (msg) {
    //console.log('mqtt publish ' + client);
    client.publish(topic, msg);
};

const getConstraintsValue = (message) => {
    let splitValues = message.split(',');
    let type = splitValues[4].replace('resourceChangeEvent(', '');
    let name = splitValues[5];
    let value = splitValues[6].replace(')', '');
    return {
        type: type.trim(),
        name: name.trim(),
        value: value.trim()
    }
};