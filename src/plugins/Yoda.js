
var request = require('request');

module.exports = function(bot) {

    /**
    * A simple wobot plugin that will display a sentence in yoda.
    * Talk in yoda by: !yoda <<message>>
    */
    bot.onMessage(function(channel, from, message) {
        if (/^!yoda (.*)/i.test(message)) {
            var sentence = message.substring(5, message.length).trim().split(' ').join('+');
            var options = {
                url: 'https://yoda.p.mashape.com/yoda?sentence=' + sentence,
                headers: {
                    'X-Mashape-Key': 'YbkavLFoacmshyxuRzywaXEucUfyp1CTGEsjsnGAtcVzJ8TCJq'
                }
            };
            request(options, function(error, response, body) {
                if (!error) {
                    bot.send({
                        jid: channel,
                        message: '@' + from.split(' ').join('') + ' ' + body
                    });
                } else {
                    console.error('Yoda: Request failed with error %j.', error);
                    bot.send({
                        jid: channel,
                        message: 'Something went wrong when using the yoda plugin.'
                    });
                }
            });
        }
    });

};
