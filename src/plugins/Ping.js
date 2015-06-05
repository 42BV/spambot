/**
* This plugin is both for fun and for debugging.
* Sometimes you want to know if the bot still responds.
* You can send a ping, it will sends a pong back.
*/
module.exports = function(bot){
    bot.onMessage(function(channel, from, message){
        if(/ping/i.test(message)){
            bot.send({
                jid: channel,
                message: 'pong'
            });
        }
    });

    bot.wobot.onPrivateMessage(function(from, message){
        if(/ping/i.test(message)){
            bot.send({
                jid: from,
                message: 'pong'
            });
        }
    });

    return {
        name: 'ping-pong'
    };
};
