var Hipchatter = require('hipchatter');
var promise = require('promise');

/**
* Wrapper around the npm module Hipchatter.
* Created the wrapper so that every function returns a promise, since callbacks are awfull.
* @param {Number} apiKey The api key.
*/
module.exports = function(apiKey) {
	this.hipchatter = new Hipchatter(apiKey);
	var functions = Object.getOwnPropertyNames(Hipchatter.prototype);
	var _self = this;
  
	functions.forEach(function(f) {
		_self[f] = function() {
			var args = [].slice.call( arguments );
			return new promise(function(resolve, reject) {
				args.push(function(err, success) {
					if (err) {
						reject(err);
					} else {
						resolve(success);
					}
				});
                        _self.hipchatter[f].apply(_self.hipchatter, args);
			})
		}
	})
};