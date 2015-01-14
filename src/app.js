var express = require('express');
var Hipchatter = require('./hipchatter');
var config = require('./config.js');
var _ = require('lodash');
var debug = require('debug')('app');
var plugins = [];

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

_.each(config.plugins, function(plugin) {
    plugins.push(require('./plugins/' + plugin));
    debug('Loaded plugin: ' + plugin);
});