const restClient = require('../utils/restClient');
const clientMqtt = require('../utils/mqttUtils');

const weatherIntervals = {};
let isOnline = false;

exports.emit_weather_temperature = (user) => {
    if (user.city) {
        weather_emit(user.city);
        if (weatherIntervals[user._id]) {
            clearInterval(weatherIntervals[user._id]);
        }
        weatherIntervals[user._id] = setInterval(() => weather_emit(user.city), 30000); // 30 seconds
    }
};

exports.clear_weather_emitter = (userId) => {
    clearInterval(weatherIntervals[userId]);
};

exports.clear_all_weather = () => {
    Object.keys(weatherIntervals).forEach(userId => clearInterval(weatherIntervals[userId]));
};

const weather_emit = (city) => {
    const queryString = "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'&format=json"
    if (isOnline) {
        restClient.get_weather_temperature(queryString)
        .then(temperature => {
            console.log("Temperature of " + city + " = " + temperature);
            let eventstr = 'msg(resourceChangeEvent,event,js,mindrobot,resourceChangeEvent(sensor, cityTemperature, ' + temperature + '),1)';
            console.log("emit > " + eventstr);
            clientMqtt.publish(eventstr);
        })
        .catch(err => next(err));
    } else {
        let temperature = 22;
        console.log("Temperature of " + city + " = " + temperature);
        let eventstr = 'msg(resourceChangeEvent,event,js,mindrobot,resourceChangeEvent(sensor, cityTemperature, ' + temperature + '),1)';
        console.log("emit > " + eventstr);
        clientMqtt.publish(eventstr);
    }
};

