var env = process.env.NODE_ENV || 'development'

var fs = require('fs')
  , sys = require('sys')
  , path = require('path')
  , config = require('./config')[env]
  , geojson = require('./lib/geojson')

var colors = {
    red: "#F85E35",
    yellow: "#FFFF63",
    green: "#70E588"
}

function export_file(name, stations) {
    var netpath = path.join(config.export_path, name + ".geojson")
    geojson.export_file(netpath, stations, function(err){
        if (err){
            console.log("error writing", netpath)
            console.log(err)
        } else {
            console.log(name, "geoJSON file updated!")
        }
    })
}

function process_network(name, stations) {
    console.log("We've got ",name, stations.length,"stations")
    for(var i = 0; i < stations.length; i++) {
        // Set colours on station markers
        // if not defined
        if (typeof stations[i].params['marker-color'] == "undefined") {
            if (stations[i].params.bikes == 0)
                stations[i].params['marker-color'] = colors.red
            else if (stations[i].params.bikes < 5)
                stations[i].params['marker-color'] = colors.yellow
            else
                stations[i].params['marker-color'] = colors.green
        }
    }
    export_file(name, stations)
}

// Bootstrap feeds
require('./feeds')(config, function(networks){
    start(networks)
})

function start(networks){
    console.log("Starting!!")
    for (var i = 0; i < networks.length; i++) {
        networks[i].update(process_network)
    }
}
