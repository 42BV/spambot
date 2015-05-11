var Wobot = require('wobot').Bot;
var Hipchatter = require('hipchatter');
var Bot = require('./bot.js');
var config = require('config');

// Initialize wobot, hipchatter and the bot
var wobot = new Wobot({
    jid: config.jid,
    password: config.password
});
var hipchatter = new Hipchatter(config.apiKey);
var bot = new Bot(wobot, hipchatter);

var intervalId;

wobot.connect();
wobot.onConnect(function() {
    // Load the plugins
    require('./manager.js')(bot);

    // Fetch the rooms at regular interval
    intervalId = setInterval(bot.setRooms, 2000);
});

wobot.onDisconnect(function(){
    clearInterval(intervalId);
});

// Set the default behaviour of the events of the wobot package
require('./wobot.js')(wobot);
