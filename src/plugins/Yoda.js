/**
 * A simple wobot plugin that will display a sentence in yoda.
 * Talk in yoda by: !yoda <<message>>
 */

var request = require('request');
var _ = require('lodash');

module.exports = function(bot) {

  bot.onMessage(function(channel, from, message) {
    if (_.startsWith('!yoda', message)) {
      var sentence = message.substring(5, message.length).trim().split(' ').join('+');
      var options = {
        url: 'https://yoda.p.mashape.com/yoda?sentence=' + sentence,
        headers: {
          'X-Mashape-Key': 'YbkavLFoacmshyxuRzywaXEucUfyp1CTGEsjsnGAtcVzJ8TCJq'
        }
      };

      request(options, function (error, response, body) {
        if (!error) {
          bot.send({
              jid: channel,
              message: '@' + from.split(' ').join('') + ' ' + body
          });
        }
      });
    }
  });
  
};