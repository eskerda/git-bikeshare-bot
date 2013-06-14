#Bike Share Bot

This code generates a bunch of geojson files for different bike sharing
networks.

The result of generating these files and keep pushing them on a repo can be
seen at [bikesharebot/bikesharestats][1].

Most of the bike sharing networks supported on this bot come from the 
[CityBikes API][2].

##Contribute

If you wish to contribute adding support for more networks, there are two 
options, depending on if you wish to contribute to the CityBikes project, 
or just to this bot.

### Contribute to this bot
To add support for a city directly in this bot, add a new file on the feeds 
folder.

Here's an example feed:
```javascript
/**
 * This file is an example on how to export a network in
 * this piece of shit
 */

var get_networks = function() {
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

var get_stations = function(callback) {
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
```
Each file gets bootstrapped on startup, so you can put there any logic you 
need to get your network (or networks).

A network is defined by
```
name: a_unique_name
latitude: float latitude of the city this network supports
longitude: ditto
update: its update function
```

And an station is defined by
```
latitude
longitude
params: {
    <any params you wish to put on a marker>
}
```

### Contribute to PyBikes
Since there's already support for the CityBikes API, you can just add support 
for any network not available in the PyBikes library (the lib behind the API). 
Once we update the library on the server, the data feed will be available on 
CityBikes, and also to this bot.

If you feel like doing it, go ahead: [PyBikes][3]

Now, the problem with this (and the reason why I hacked a way to support more
networks onto this bot) is that PyBikes is getting rewritten, and the next
version is not yet running on production. So, any code contributed to the
master branch means code that will have to be ported to the new architecture
sooner or later.

##Purpose
Since GitHub now supports rendering geojson files, having a backup of the
latest bike share information on a repo might come handy every time one
of the sites starts 404d.

[1]: http://github.com/bikesharebot/bikesharestats
[2]: http://api.citybik.es
[3]: http://github.com/eskerda/pybikes
