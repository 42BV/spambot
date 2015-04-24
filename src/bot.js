var Q = require('q');
var _ = require('lodash');

/**
 * Acts as an interface to the wobot and hipchatter plugin.
 * It exposes both of them, but you can use some nice wrappers as well.
 */
module.exports = function(wobot, hipchatter) {
    var self = {
        wobot: wobot,
        hipchatter: hipchatter,
        rooms: []
    };

    /**
     * Binds the message event.
     * Usage: ```plugin.onMessage(function(channel, sender, message){
     *    // Do smh fancy
     *});```
     */
    self.onMessage = wobot.onMessage;

    /**
     * Sends a message to a room or a person.
     * If either html or color is given, it will use the hipchatter.
     * Otherwise it will use the wobot to send the message.
     * This is done to preserver the number of api requests.
     * It should have either the id (used by the rest api (hipchatter)) or the jid (used by xmpp (wobot)).
     * @param {Object} options The object contain the message, id, jid, color or html flag.
     * @param {String} options.message The message. If it contains html tags, the html flag should be set.
     * @param {Boolean} options.html Indicating if it is a htlm message or not.
     * @param {String} options.color Should be one of: 'yellow, green, red, purple, gray, random'.
     * @param {Number} options.roomId The id of the room.
     * @param {String} options.jid The jid of the room.
     * @return {Q} a promise.
     */
    self.send = function(options) {
        var deferred = Q.defer();
        if (!options.message) {
            throw new Error('bot:send expects message to be set.');
        }
        if (!(options.jid && options.roomId)) {
            throw new Error('bot:send expects either \'id\' or \'jid\' to be set.');
        }
        if (options.html || options.color) {
            var roomId = options.roomId || _.find(self.rooms, {
                jid: options.jid
            }).id;
            Q.ninvoke(hipchatter, 'notify', roomId, options)
                .then(deferred.resolve, deferred.reject);
        } else {
            var jid = options.jid || _.find(self.rooms, {
                id: options.roomId
            }).jid;
            wobot.message(jid, options.message);
            deferred.resolve();
        }
        return deferred.promise;
    };

    /**
    * Sets the rooms, is necessary to find the jid by the id or vice versa.
    * @return {Q} the promise.
    */
    self.setRooms = function() {
        var deferred = Q.defer();
        Q.ninvoke(wobot, 'getRooms')
            .then(function(rooms) {
                self.rooms = rooms[0];
                deferred.resolve(rooms[0]);
            }, deferred.reject);
        return deferred.promise;
    };

    return self;
};
