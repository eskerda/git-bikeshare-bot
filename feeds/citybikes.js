var request = require('request')

var base_url = "http://api.citybik.es"
  , networks_url = base_url + '/networks.json'

function get_networks(callback) {
    request.get(networks_url, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            callback(err, JSON.parse(body))
        } else {
            callback(err, [])
        }
    })
}

function get_stations(network, callback) {
    request.get(network, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            callback(err, JSON.parse(body))
        } else {
            callback(err, [])
        }
    })
}

function prepare_station (station) {
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

function update_factory (network) {
    var update = function(callback){
        var timeout = setTimeout(function(){
            timeout = null
            console.log("Timeout on ", network.name)
            // Trigger error
            callback(network.name, [])
        }, 10000)

        get_stations(network.url, function (err, stations) {
            if (timeout) {
                clearTimeout(timeout)
                var date
                export_stations = []
                for (var i = 0; i < stations.length; i++) {
                    export_stations.push(prepare_station(stations[i]))
                }
                callback(network.name, export_stations)
            }
        })
    }
    return update
}

function export_networks (networks, callback) {
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
