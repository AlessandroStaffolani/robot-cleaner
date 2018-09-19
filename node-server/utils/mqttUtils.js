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
    let promise = null;
    if (payloadString.indexOf('resourceChangeEvent') !== -1) {

        // QA ci dice che cambia il resource model in particolare temperatura, ora e led
        let payloadData = handleResourceChangeEvent(payloadString);
        promise = resourceModelActions.update_resource(payloadData.type, payloadData.name, payloadData.objectData)

    } else if (payloadString.indexOf('execMoveRobot') !== -1) {

        // QA ci dice che il robot si muove, aggiorno il resource model
        let command = handleExecMoveRobot(payloadString);
        promise = resourceModelActions.update_executors_last_action(command)

    } else if (payloadString.indexOf('sonar(') !== -1) {

        // QA ci dice che i sonar virtuali della stanza emettono informazioni
        let payloadData = handleSonarVirtualRoom(payloadString);
        promise = resourceModelActions.update_sensonr_value(payloadData.category, payloadData.name, payloadData.value)

    } else if (payloadString.indexOf('sonarDetect') !== -1) {

        // QA ci dice che il sonar sul robot virtuale emette informazioni
        let payloadData = handleSonarVirtual(payloadString);
        promise = resourceModelActions.update_sensonr_value(payloadData.category, payloadData.name, payloadData.value)

    }

    if (promise !== null){
        promise.then(() => publishResourceModelUpdated())
            .catch(err => console.log(err));
    }
    console.log("mqtt RECEIVES:" + message.toString()); //if toString is not given, the command comes as buffer
});

exports.publish = function (msg) {
    console.log('mqtt publish ' + msg);
    client.publish(topic, msg);
};

const publishResourceModelUpdated = (payload = 'true') => {
    console.log('mqtt publish resource model update ' + payload);
    client.publish(topic, 'msg(resource_model_update,dispatch,js,react,resource_model_update(payload(' + payload + ')),1)');
};

exports.publishResourceModelUpdated = publishResourceModelUpdated;

const handleResourceChangeEvent = (message) => {
    let splitValues = message.split(',');
    let type = splitValues[4].replace('resourceChangeEvent(', '');
    let name = splitValues[5];
    let value = splitValues[6].replace(')', '');
    value = value.trim().toLowerCase();
    if (value === 'off') {
        value = false
    } else if (value === 'on') {
        value = true;
    } 
    let objectData = {};
    if (type === 'executor') {
        objectData.state = value
    } else {
        objectData.value = value
    }
    return {
        type: type.trim(),
        name: name.trim(),
        objectData: objectData
    }
};

const handleExecMoveRobot = (message) => {
    let splitValues = message.split(',');
    let command = splitValues[4].replace('usercmd(robotgui(', '').split('(')[0];
    return command.trim();
};

const handleSonarVirtualRoom = (message) => {
    let splitValues = message.split(',');
    let payload = splitValues[4].replace('sonar(', '');
    let name = payload.trim();
    let value = parseInt(splitValues[6].trim(), 10)
    return {
        category: 'sonarVirtual',
        name: name,
        value: value
    }
};

const handleSonarVirtual = (message) => {
    let splitValues = message.split(',');
    let value = splitValues[4].replace('sonarDetect(', '').trim();
    return {
        category: 'sonarRobot',
        name: 'sonarVirtual',
        value: value.replace(')', '')
    }
};