const restClient = require('../utils/restClient');
const clientMqtt = require('../utils/mqttUtils');

// Weather api: https://developer.yahoo.com/weather/
exports.get_city_temperature = (req, res, next) => {
    const city = req.params.city;
    const queryString = "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'&format=json"
    restClient.get_weather_temperature(queryString)
        .then(temperature => {
            console.log("Temperature of " + city + " = " + temperature);
            let eventstr = 'msg(resourceChangeEvent,event,js,mindrobot,resourceChangeEvent(sensor, cityTemperature, ' + temperature + '),1)';
            console.log("emit > " + eventstr);
            clientMqtt.publish(eventstr);
            res.header('Content-Type', 'application/json');
            res.status(200);
            res.json({temperature: temperature});
        })
        .catch(err => next(err));
};