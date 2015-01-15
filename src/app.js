var Hipchatter = require('./hipchatter');
var config = require('./config.js');
var _ = require('lodash');
var debug = require('debug')('app');
var plugins = [];
var Poller = require('./poller');

// Check if everyting in the config file has the right type.
(function(config, required) {
    _.each(required, function(r) {
        if (!config[r.name]) {
            throw new Error('Missing attribute: ' + r.name + ' in the config file.');
        } else if (!config[r.name] instanceof r.type) {
            throw new Error('Expected type: ' + r.type + ' for ' + r.name + '.');
        }
    })
})(config, [{
    name: 'plugins',
    type: Array
}, {
    name: 'apiKey',
    type: String
}]);

// Creates an instance of the hipchatter wrapper.
var hipchatter = new Hipchatter(config.apiKey);

// Load all plugins.
_.each(config.plugins, function(plugin) {
    var constr = require('./plugins/' + plugin + '.js');
    plugins.push(new constr(hipchatter, 'testbotroom'));
    debug('Loaded plugin: ' + plugin);
});

// Create a new poller and start running. At this moment 5 is the maximum because of the limited api calls we can make.
(new Poller(5,
    function() {
        // For now just always enter the testbotroom.
        return hipchatter.history('testbotroom');
    },
    function(message) {
        _.each(plugins, function(plugin) {
            _.each(plugin.listeners, function(listener) {
                if (listener.pattern.test(message.message) && listener.event === message.type) {
                    // In case someone forgot the implement that function.
                    if(!plugin[listener.callback]){
                        console.error('The plugin: ', plugin.name, ' did not implement: ' + listener.callback + '.');
                    }
                    plugin[listener.callback](message);
                }
            })
        })
    })).start();
