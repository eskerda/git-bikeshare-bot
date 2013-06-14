var env = process.env.NODE_ENV || 'development';

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

var networks = []
var feeds = []

/**
 * Bootstrap feeds
 *
 * Really hackish way to make feed loading synchronous..
 * Don't do this, EVER
 *
 */

fs.readdirSync(config.feed_path).forEach(function (file) {
    feeds.push(file)
    require(path.join(config.feed_path, file))( function( module_nets ) {
        for (var i = 0; i < module_nets.length; i++)
            networks.push(module_nets[i])
        console.log(file, "loaded")
        feeds.pop()
    })
})

var check_feeds = function( callback ) {
    if (feeds.length > 0) {
        setTimeout(function(){check_feeds(callback)}, 100)
    } else {
        callback()
    }
}

var export_file = function(name, stations) {
    var netpath = path.join(
        config.export_path, name + ".geojson"
    )
    geojson.export_file(netpath, stations, function(err){
        if (err){
            console.log("error writing", netpath)
            console.log(err)
        } else {
            console.log(name, "geoJSON file updated!")
        }
    })
}

var start = function() {
    check_feeds(function(){
        console.log("Start doin shit!")
        for (var i = 0; i < networks.length; i++) {
            networks[i].update(function(name, stations) {
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
            })
        }
    })
}

start()