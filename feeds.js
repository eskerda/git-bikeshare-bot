var fs = require('fs')
  , path = require('path')
var networks = []
var feeds = []

module.exports = function(config, onComplete) {
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
    check_feeds(onComplete)
}

function check_feeds(callback) {
    if (feeds.length > 0) {
        setTimeout(function(){check_feeds(callback)}, 100)
    } else {
        callback(networks)
    }
}