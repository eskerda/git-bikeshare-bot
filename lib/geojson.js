/** This could be better done, I don't feel like being the one **/

var fs = require('fs')

module.exports = {
    get_feature_collection: function() {
        return {
            "type": "FeatureCollection",
            "features": []
        }
    },
    get_geometry: function(type, coordinates) {
        return {
            type: type,
            coordinates: coordinates
        }
    },
    add_feature: function(collection, id, properties, geometry) {
        collection["features"].push({
            type: "Feature",
            id: id,
            properties: properties,
            geometry: geometry
        })
        return collection
    },
    export_file: function(file_path, points, callback) {
        var geo_stats = this.get_feature_collection()
        var color, date
        for (var i = 0; i < points.length; i++) {
            geo_stats = this.add_feature(
                geo_stats, i, points[i].params,
                this.get_geometry("Point",
                    [points[i].longitude, points[i].latitude]
                )
            )
        }
        
        fs.writeFile(file_path, JSON.stringify(geo_stats, null, 4), callback)
    }
}
