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

var prepare_station = function(station) {
    // Hack for the CityBikes timestamps
    // being GMT+2 and not indicated
    var date = new Date(station.timestamp)
    date.setHours(date.getHours()-2)

    return {
        latitude: station.lat/1E6,
        longitude: station.lng/1E6,
        params: {
            name: station.name,
            timestamp: date.toISOString(),
            bikes: station.bikes,
            slots: station.free
        }
    }
}

var update_factory = function(network) {
    var update = function(callback){
        get_stations(network.url, function (err, stations) {
            var date
            export_stations = []
            for (var i = 0; i < stations.length; i++) {
                export_stations.push(prepare_station(stations[i]))
            }
            callback(network.name, export_stations)
        })
    }
    return update
}

var export_networks = function(networks, callback) {
    var exp_networks = []
    for (var i = 0; i < networks.length; i++) {
        var network = networks[i]
        exp_networks.push({
            name: network.name,
            latitude: network.lat/1E6,
            longitude: network.lng/1E6,
            update: update_factory(network)
        })
    }
    callback(exp_networks)
}

module.exports = function(callback) {
    get_networks(function(err, networks){
        export_networks(networks, callback)
    })
}
