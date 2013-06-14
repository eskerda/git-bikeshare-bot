/**
 * This file is an example on how to export a network in
 * this piece of shit
 */

function get_networks() {
    // In this part, you would have to do stuff if you need to
    // get more than one network, If the system just have one
    // network, just hard type any values you need
    //
    // For instance

    return [{
        name: 'my_unique_name',
        latitude: 0.0, // The latitude of this system (city)
        longitude: 0.0, // ditto
        update: get_stations
    }]
}

function get_stations (callback) {
    // In this method, you should adquire the data from the
    // network, and prepare the stations to be feeded to
    // the exporter. Once done, call the callback.
    // The request library might come handy
    //
    // In the exemple, this is just hardtyped, for a real
    // world example look into citybikes.js

    var stations = [{
        latitude: 0.0,      //latitude of this station
        longitude: 0.0,     //longitude of this station
        params: {           // Any params you wish to display on the marker
            name: 'This is my name',
            timestamp: 'The last time I was updated, in Zulu UTC',
            bikes: 10,      // How many bicycles do I have?
            slots: 10,      // How many slots do I have?
        }
    }]

    callback('my_unique_name', stations)
}

module.exports = function(callback) {
    var networks = get_networks()
    callback(networks)
}
