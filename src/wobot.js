var debug = require('debug')('wobot');

// Defines the default behaviour on each possible event of wobot.
module.exports = function() {
    bot.onConnect(function() {
        debug('Connected');
    });

    bot.onMessage(function(channel, from, message) {
        debug(from + ' said in ' + channel + ' the following: ' + message + '.');
    });

    bot.onInvite(function(roomJid, fromJid, reason) {
        debug('Invite to ' + roomJid + ' by ' + fromJid + ': ' + reason);
        this.join(roomJid);
    });

    bot.onPing(function() {
        debug('Ping? Pong!');
    });

    bot.onDisconnect(function() {
        debug('Disconnected');
    });

    bot.onError(function(error, text) {
        debug('Error: ' + error + ' (' + text + ')');
    });

    bot.onPrivateMessage(function(jid, message) {
        debug(jid + ' pm\'d: ' + message);
    });
};
