var Bot = require('wobot').Bot;
var _ = require('lodash');
var config = require('config');
var minimist = require('minimist')(process.argv.slice(2));
var debug = require('debug')('app');

// Retrieves the password for the XMPP
if (!minimist.u || !minimist.p) {
    throw 'You should give the jid (-u) and password (-p) for the bot account or your own account.';
}

// Create a new bot
var bot = new Bot({
    jid: minimist.u
    password: minimist.p
});

var manager = new require('./manager.js')(bot);

// Connect to the hipchat server
bot.connect();

// The default behaviour of all events that can occur.
bot.onConnect(function() {
    debug('Connected');
    this.join('69596_api_test_room@conf.hipchat.com');
});

bot.onMessage(function(channel, from, message) {
    debug(from + ' said in ' + channel + ' the following: ' + message + '.');
});

bot.onInvite(function(roomJid, fromJid, reason) {
    Debug('Invite to ' + roomJid + ' by ' + fromJid + ': ' + reason);
    this.join(roomJid);
});

bot.onPing(function() {
    debug('Ping? Pong!');
});

bot.onDisconnect(function() {
    debug('Disconnected');
});

bot.onError(function(error, text, stanza) {
    debug('Error: ' + error + ' (' + text + ')');
});

bot.onPrivateMessage(function(jid, message) {
    Debug(jid + ' pm\'d: ' + message);
});
