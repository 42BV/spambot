var Bot = require('wobot').Bot;
var minimist = require('minimist')(process.argv.slice(2));
var debug = require('debug')('app');
var Hipchatter = require('hipchatter');

// Retrieves the password for the XMPP
if (!minimist.u || !minimist.p || !minimist.k) {
    throw 'You should give the jid (-u), password (-p) and the api key (-k) for the bot account or your own account.';
}

// Create a new bot
var bot = new Bot({
    jid: minimist.u,
    password: minimist.p
});

var hipchatter = new Hipchatter(minimist.k);
var manager = require('./manager.js')(bot, hipchatter);

debug('start connecting');
// Connect to the hipchat server
bot.connect();

// The default behaviour of all events that can occur.
bot.onConnect(function() {
    debug('Connected');
    manager.startFetching(5000);
    this.join('69596_api_test_room@conf.hipchat.com');
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

