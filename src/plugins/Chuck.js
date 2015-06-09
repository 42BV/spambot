/**
 * A simple wobot plugin that will display a random
 * Chuck Norris joke on the command !chuck
 */

var request = require('request');

bot.onMessage(function(channel, from, message) {
  if (message === '!chuck') {
    request('http://api.icndb.com/jokes/random', function (error, response, body) {
      if (!error) {
        var data = JSON.parse(body);
        bot.send({
            jid: channel,
            message: '@' + from.split(' ').join('') + ' ' + data.value.joke.replace('&quot;', '"')
        });
      }
    });
  }
};
