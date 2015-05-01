var request = require('request');
var debugErr = require('debug')('plugin:gifme:error');

//In production we should request an unique key from https://github.com/GifMe/GifMeApi
var gifmeKey = 'rX7kbMzkGu7WJwvG';

module.exports = function(bot) {
    var self = {
        name: 'gifme',
        pattern: /!gifme (.*)/i
    };

    /**
     * Sends a link to a gif or image depending on what the person said.
     * @param {String} channel The channel in which it was said.
     * @param {String} from The JID of the person who said it.
     * @param {String} message The message.
     */
    self.gifme = function(channel, from, message) {
        var query = self.pattern.exec(message)[1];
        var url = 'http://api.gifme.io/v1/search?sfw=true&page=0&limit=1&query=' + query + '&key=' + gifmeKey;
        var to = '@' + from.split(' ').join('');

        request(url, function(error, response, body) {
            var message = to + ' ';
            if (error) {
                debugErr('Request %s failed with error %j.', query, error);
                message += 'An error occured retrieving your gif.';
            } else {
                body = JSON.parse(body);
                if (body.data.length === 0) {
                    message += 'No gifs found for \'' + query + '\'.';
                } else {
                    message += body.data[0].link.replace(' ', '%20');
                }
            }
            bot.send({
                jid: channel,
                message: message
            });
        });
    };

    bot.onMessage(function(channel, from, message) {
        if (self.pattern.test(message)) {
            self.gifme(channel, from, message);
        }
    });

    return self;
};
