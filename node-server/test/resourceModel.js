const resourceModelActions = require('../model/resourceModelActions');

let initPromise = resourceModelActions.init().then(() => {
    let populateSensorsPromise = resourceModelActions.populate_sensors();
    let populateActuatorsPromise = resourceModelActions.populate_actuators();
    let populateExecutorsPromise = resourceModelActions.populate_executors();

    Promise.all([
        populateSensorsPromise,
        populateActuatorsPromise,
        populateExecutorsPromise,
    ])
        .then(() => {
            resourceModelActions.get_resource_model().then(resourceModel => {
                console.log(resourceModel);
                console.log(resourceModel.executors);
            });
        })
});
initPromise.catch(err => console.log(err));