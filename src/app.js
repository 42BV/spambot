var Bot = require('wobot').Bot;
var minimist = require('minimist')(process.argv.slice(2));
var Hipchatter = require('hipchatter');

if (!minimist.u || !minimist.p || !minimist.k) {
    throw 'You should give the jid (-u), password (-p) and the api key (-k) for the bot account or your own account.';
}

var bot = new Bot({
    jid: minimist.u,
    password: minimist.p
});

var hipchatter = new Hipchatter(minimist.k);

bot.onConnect(function() {
    require('./manager.js')(bot, hipchatter).startFetching(5000);
    this.join('69596_api_test_room@conf.hipchat.com');
});
