var path = require('path')
var root_path = __dirname

module.exports = {
    development: {
        export_path: path.join(root_path, '../bikegeojson/'),
        feed_path: path.join(root_path, 'feeds/'),
        interval: 300000
    }
}
