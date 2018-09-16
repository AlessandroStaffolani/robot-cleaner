const abstractController = require('./abstractController');

const MapModel = require('../model/map');

exports.save_map = (req, res, next) => {

    const requestMap = req.body.map;
    console.log(requestMap);
    
    MapModel.findOne()
        .then(map => {
            if (map) {
                // La mappa è presente nel db
                map.boxes = requestMap;
                map.save().then(map => abstractController.return_request(req, res, next, map));
            } else {
                new MapModel({
                    boxes: requestMap
                }).save().then(map => abstractController.return_request(req, res, next, map));
            }
        })
        .catch(err => next(err));
}