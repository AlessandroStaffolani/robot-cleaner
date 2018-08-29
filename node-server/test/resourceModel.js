const resourceModelActions = require('../model/resourceModelActions');
const Sensor = require('../model/sensor');

let initPromise = resourceModelActions.init().then(() => {
    let populateSensorsPromise = resourceModelActions.populate_sensors();
    let populateActuatorsPromise = resourceModelActions.populate_actuators();
    let populateExecutorsPromise = resourceModelActions.populate_executors();

    let populateResourceModelPromie = Promise.all([
        populateSensorsPromise,
        populateActuatorsPromise,
        populateExecutorsPromise,
    ])
        .then(() => {
            resourceModelActions.get_resource_model().then(resourceModel => {
                console.log(resourceModel);
                console.log(resourceModel.executors);
            });
        });
    populateResourceModelPromie.catch(err => console.log(err));
    populateResourceModelPromie.then(() => {
        resourceModelActions.update_resource(Sensor, "clock1", {
            value: 18
        }).then(() => {
            resourceModelActions.get_resource_model().then(resourceModel => console.log(resourceModel));
        })
    })
});
initPromise.catch(err => console.log(err));