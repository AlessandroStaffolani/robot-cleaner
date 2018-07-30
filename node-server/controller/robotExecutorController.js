const clientMqtt = require('../utils/mqttUtils');
const abstractController = require('./abstractController');

exports.command = (req, res, next) => {
    const command = req.params.cmd;
    let cmd = command + '(low)';
    let msgstr = 'msg(moveRobot,dispatch,js,mindrobot,usercmd(robotgui( ' + cmd + ')),1)';
    console.log("send > " + msgstr);
    clientMqtt.publish(msgstr);

    abstractController.return_request(req, res, next, {
        command: command,
        event: msgstr
    })
};