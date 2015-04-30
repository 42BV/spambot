var Wobot = require('wobot').Bot;
var minimist = require('minimist')(process.argv.slice(2));
var Hipchatter = require('hipchatter');
var Bot = require('./bot.js');

if (!minimist.u || !minimist.p || !minimist.k) {
    throw 'You should give the jid (-u), password (-p) and the api key (-k) for the bot account or your own account.';
}

// Initialize wobot, hipchatter and the bot
var wobot = new Wobot({
    jid: minimist.u,
    password: minimist.p
});
var hipchatter = new Hipchatter(minimist.k);
var bot = new Bot(wobot, hipchatter);

var intervalId;

wobot.connect();
wobot.onConnect(function() {
    // Load the plugins
    require('./manager.js')(bot);

    // Join the test room for debuggin purposes
    this.join('69596_api_test_room@conf.hipchat.com');

    // Fetch the rooms at regular interval
    intervalId = setInterval(bot.setRooms, 2000);
});

wobot.onDisconnect(function(){
    clearInterval(intervalId);
});

// Set the default behaviour of the events of the wobot package
require('./wobot.js')(wobot);
