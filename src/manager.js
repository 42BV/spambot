var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')('manager');

/**
* Manages all the plugins.
* @param {Object} bot The bot as created by the package wobot.
*/
module.exports = function(bot) {
    var self = {
        plugins: []
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
    _.each(getPluginNames(), function(plugin) {
        var Constr = require('./plugins/' + plugin + '.js');
        self.plugins.push(new Constr(bot));
        debug('Loaded plugin: ' + plugin);
    });

    return self;
};
