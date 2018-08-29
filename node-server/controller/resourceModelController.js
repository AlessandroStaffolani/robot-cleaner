const abstractController = require('./abstractController');
const resourceModelActions = require('../model/resourceModelActions');

exports.get_resource_model = (req, res, next) => {
    resourceModelActions.get_resource_model()
        .then(resourceModel => {
            abstractController.return_request(req, res, next, { resourceModel: resourceModel })
        })
};