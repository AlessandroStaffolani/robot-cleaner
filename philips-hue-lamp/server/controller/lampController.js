const socketServer = require('../utils/SocketServer');

const Lamp = require('../model/lamp');

let refreshIntervalId = {};

const add_lamp = (req, res, next) => {
    const lampData = req.body.lamp;
    if (lampData) {
        let lamp = new Lamp({
            name: lampData.name,
            value: lampData.value,
            color: lampData.color,
            code: lampData.code
        });

        lamp.save()
            .then(lamp => {
                res.header('Content-Type', 'application/json');
                res.status(200);
                res.json({
                    lamp: lamp
                });
            })
            .catch(err => next(err));
    } else {
        res.header('Content-Type', 'application/json');
        res.status(400);
        res.json({
            error: 'Lamp data didn\'t provide'
        });
    }
};

const update_status = (req, res, next) => {
    const codeLamp = req.params.code;
    let lampPromise = Lamp.findOne({code: codeLamp})
        .then(lamp => {
            if (lamp) {
                const value = req.body.value;
                const color = req.body.color;
                lamp.value = value;
                lamp.color = color;
                return lamp.save().then(lamp => lamp).catch(err => next(err));
            } else {
                res.header('Content-Type', 'application/json');
                res.status(400);
                res.json({
                    error: 'Lamp id doesn\'t exist'
                });
            }
        });
    lampPromise.then(lamp => {
    	socketServer.emitAll('color', lamp.color);
    	socketServer.emitAll('value',lamp.value);
        res.header('Content-Type', 'application/json');
        res.status(200);
        res.json({
            lamp: lamp
        });
        
    })
};

const blink_lamp = (req, res, next) => {
    const codeLamp = req.params.code;
    let lampPromise = Lamp.findOne({code: codeLamp})
        .then(lamp => {
            if (lamp) {
                const value = req.body.value;
                const color = req.body.color;
                lamp.value = value;
                if (color) {
                    lamp.color = color;
                }
                return lamp.save().then(lamp => lamp).catch(err => next(err));
            } else {
                res.header('Content-Type', 'application/json');
                res.status(400);
                res.json({
                    error: 'Lamp id doesn\'t exist'
                });
            }
        });
    lampPromise.then(lamp => {
    	//socketServer.emitToClient(codeLamp, 'value', lamp.value);
        socketServer.emitToClient(codeLamp, 'color', lamp.color);
    	if(lamp.value) {
        	if(refreshIntervalId[codeLamp] === undefined){
        		/*Blinking (se già sta blinkando non viene chiamata)*/
	        	refreshIntervalId[codeLamp] = setInterval(()=>{
	        		socketServer.emitToClient(codeLamp, 'value', lamp.value);
	        		lamp.value = !lamp.value;
	        	}, 2000);
        	}
        }
        else {
        	if(refreshIntervalId[codeLamp] !== undefined){
        		clearInterval(refreshIntervalId[codeLamp]);
        		refreshIntervalId[codeLamp] = undefined;
        	}
        	socketServer.emitToClient(codeLamp, 'value', lamp.value);
        }
        res.header('Content-Type', 'application/json');
        res.status(200);
        res.json({
            lamp: lamp
        });
        
    })
};


exports.get_lamps = (req, res, next) => {
    Lamp.find()
        .then(lamps => {
            res.header('Content-Type', 'application/json');
            res.status(200);
            res.json({
                lamps: lamps
            });
        })
};

exports.add_lamp = add_lamp;
exports.update_status = update_status;
exports.blink_lamp = blink_lamp;