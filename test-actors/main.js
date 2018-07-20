const mqtt = require('mqtt');
const requirements = require('./test/requirements');
const topic = requirements.mqtt.topic;
const host = requirements.mqtt.host;
const toExcludMessages = requirements.toExcludMessages;

const messagesReceved = [];

const clientMqtt = mqtt.connect(host);

clientMqtt.on('connect', function () {
    clientMqtt.subscribe(topic);
    console.log('client test mqtt has subscribed successfully ');
});

clientMqtt.on('message', function (topic, message) {
    let toExclud = false;
    toExcludMessages.forEach(excludMessage => {
        if (message.indexOf(excludMessage) !== -1) {
            toExclud = true;
        }
    });
    if (!toExclud) {
        messagesReceved.push(message.toString());
    }
});

