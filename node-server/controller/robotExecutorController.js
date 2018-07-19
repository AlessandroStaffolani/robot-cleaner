const clientMqtt = require('../utils/mqttUtils');
const abstractController = require('./abstractController');
const MQTT_TOPIC = 'unibo/qasys';

exports.command = (req, res, next) => {
    const command = req.params.cmd;
    let cmd = command + '(low)';
    let eventstr = 'msg(moveRobot,dispatch,js,robotexecutor,usercmd(robotgui( ' + cmd + ')),1)';
    console.log("emits > " + eventstr);
    clientMqtt.publish(eventstr);

    abstractController.return_request(req, res, next, {
        command: command,
        event: eventstr
    })
};