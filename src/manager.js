var path = require('path');
var fs = require('fs');
var debug = require('debug')('manager');

/**
 * Manages all the plugins.
 * @param {Object} bot The bot.
 */
module.exports = function(bot) {
    var self = {
        plugins: [],
    };

    /**
     * Retrieves all the plugin names in the directory /src/plugins/
     * @return {Array} name of all the plugins.
     */
    var getPluginNames = function() {
        var files = fs.readdirSync(__dirname + '/plugins');

        return _(files)
            .filter(function(file) {
                return path.extname(file) === '.js';
            })
            .map(function(file) {
                return path.basename(file, '.js');
            })
            .value();
    };

    // Load all plugins.
    getPluginNames().forEach(function(plugin) {
        var Constr = require('./plugins/' + plugin + '.js');
        self.plugins.push(new Constr(bot));
        debug('Loaded plugin: ' + plugin);
    });

    return self;
};
