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
 * This file is an example on how to export a network
 * for this bot
 */

module.exports = function( callback ) {
    exp_networks = [
        {
            name: 'unique_name_of_the_system',
            latitude: 0.0, //'systems latitude, as a float'
            longitude: 0.0, //'systems longitude as a float'
            update: function(update_callback) {
                // Logic to get the stations that form this network
                stations = [
                    {
                        latitude: 0.0, // latitude of this station
                        longitude: 0.0, // longitude of this station
                        params: {
                            some: 'params',
                            appearing: 'in the balloon',
                            of: 'this station, for instance',
                            name: 'Station name',
                            bikes: 'My bicycles',
                            slots: 'empty spaces',
                            timestamp: 'The time I was updated, in UTC+0'
                        }
                    }
                ]

                // now, we can pass back these stations
                update_callback('unique_name_of_the_system', stations)
            }
        }
    ]
    // And, here, we pass back the networks from this file, as an array
    callback(exp_networks)
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
