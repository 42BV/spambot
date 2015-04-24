var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')('manager');
var Q = require('q');

/**
 * Manages all the plugins.
 * @param {Object} bot The bot as created by the package wobot.
 */
module.exports = function(wobot, hipchatter) {
    var self = {
        plugins: [],
        rooms: []
    };

    var repeatId;

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
        self.plugins.push(new Constr(wobot, hipchatter, self));
        debug('Loaded plugin: ' + plugin);
    });

    /**
     * Fetches all the rooms with jid and id.
     */
    self.fetchRooms = function() {
        Q.ninvoke(wobot, 'getRooms')
            .then(function(rooms) {
                self.rooms = rooms[0];
            });
    };

    /**
     * Starts fetching the rooms at interval.
     */
    self.startFetching = function(interval) {
        repeatId = setInterval(function() {
            self.fetchRooms();
        }, interval);
    };

    /**
     * Stops fetching rooms.
     */
    self.stopFetching = function() {
        clearInterval(repeatId);
    };

    return self;
};
