const RestClient = require('node-rest-client').Client;
const client = new RestClient();

exports.get = (query) => {
    return new Promise((resolve, reject) => {
        client.get(query, (data, response) => {
            if(data){
                resolve(data);
            } else {
                reject("No result");
            }
        })
    })
};

exports.get_weather_temperature = (query) => {
    return new Promise((resolve, reject) => {
        client.get(query, (data, response) => {
            if( data.query.results == null ){
                reject("No result");
            } else {
                if( data.query.results.channel.item != null ){
                    resolve(data.query.results.channel.item.condition.temp);
                } else {
                    reject("No item result");
                }
            }
        })
    })
};