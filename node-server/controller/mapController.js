const abstractController = require('./abstractController');
const clientMqtt = require('../utils/mqttUtils');

const MapModel = require('../model/map');

exports.get_current_map = (req, res, next) => {
    MapModel.findOne()
        .then(map => {
            abstractController.return_request(req, res, next, {map})
        })
        .catch(err => next(err));
}

exports.save_map = (req, res, next) => {

    const requestMap = req.body.map;
    const msgstr = 'msg(map_ready,dispatch,js,react,map_ready(payload(X)),1)';
    
    MapModel.findOne()
        .then(map => {
            if (map) {
                // La mappa è presente nel db
                map.date = Date.now();
                map.boxes = undefined;
                map.boxes = requestMap;
                map.save().then(map => {
                    console.log("send > " + msgstr);
                    clientMqtt.publish(msgstr);
                    abstractController.return_request(req, res, next, {map})
                })
                .catch(err => next(err));
            } else {
                new MapModel({
                    boxes: requestMap
                }).save().then(map => {
                    console.log("send > " + msgstr);
                    clientMqtt.publish(msgstr);
                    abstractController.return_request(req, res, next, {map})
                })
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));
}