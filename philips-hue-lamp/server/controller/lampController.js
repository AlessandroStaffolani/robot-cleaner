const socketServer = require('../utils/SocketServer');

const Lamp = require('../model/lamp');

const add_lamp = (req, res, next) => {
    const lampData = req.body.lamp;
    if (lampData) {
        let lamp = new Lamp({
            name: lampData.name,
            value: lampData.value,
            color: lampData.color
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
    const idLamp = req.params.id;
    let lampPromise = Lamp.findById(idLamp)
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
        socketServer.emit('color', lamp.color);
        socketServer.emit('value', lamp.value);
        res.header('Content-Type', 'application/json');
        res.status(200);
        res.json({
            lamp: lamp
        });
    })
};

exports.add_lamp = add_lamp;
exports.update_status = update_status;