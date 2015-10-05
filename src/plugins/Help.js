module.exports = function(bot) {
    var self = {
        name: 'help',
        pattern: /!bot|!help/
    };

    var helpMessage = [
        'Hi dev, I\'m here to help you in your daily tasks by providing helpful functions.',
        'Are you missing a feature, please write one and submit a pull request to http://www.github.com/42bv/spambot.',
        'See https://github.com/42BV/spambot/tree/master/src/plugins on how to write one.',
        'For an overview of all the possible commands see https://github.com/42BV/spambot/blob/master/README.md#commands'
    ].join('\n');

    bot.onMessage(function(channel, from, message) {
        if (self.pattern.test(message)) {
            bot.send({
                jid: channel,
                message: helpMessage,
                html: false
            });
        }
    });

    bot.wobot.onPrivateMessage(function(from, message) {
        if (self.pattern.test(message)) {
            bot.send({
                jid: from,
                message: helpMessage,
                html: false
            });
        }
    });

    return self;
};
