var request = require('request')

var base_url = "http://api.citybik.es"
  , networks_url = base_url + '/networks.json'

var get_networks = function(callback) {
    request.get(networks_url, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            callback(err, JSON.parse(body))
        } else {
            callback(err, [])
        }
    })
}

var get_stations = function(network, callback) {
    request.get(network, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            callback(err, JSON.parse(body))
        } else {
            callback(err, [])
        }
    })
}

module.exports = function( callback ) {
    get_networks(function(err, networks){
        var exp_networks = []
        for (var i = 0; i < networks.length; i++) {
            var network = networks[i]
            exp_networks.push({
                name: networks[i].name,     // Unique id of this network
                latitude: networks[i].lat/1E6,  // Latitude of this network
                longitude: networks[i].lng/1E6, // Longitude of this network
                update: function( update_callback ) {
                    var name = this.name
                    get_stations(this.url, function(err, stations) {
                        /** Here we would set appropiate attributes
                            to each station, to be read on updatestats.js
                            name, latitude, longitude, timestamp, bikes, slots
                            and then send them back on the callback
                        **/
                        clean_stations = []
                        var date
                        for (var i = 0; i < stations.length; i++) {
                            // Hack for the CityBikes timestamps
                            // being GMT+2 and not indicated
                            date = new Date(stations[i].timestamp)
                            date.setHours(date.getHours()-2)

                            clean_stations.push({
                                latitude: stations[i].lat/1E6,
                                longitude: stations[i].lng/1E6,
                                params: {
                                    name: stations[i].name,
                                    timestamp: date.toISOString(),
                                    bikes: stations[i].bikes,
                                    slots: stations[i].free
                                }
                            })
                        }
                        update_callback(name, clean_stations)
                    })
                }.bind(network)
            })
        }
        callback(exp_networks)
    })
}
