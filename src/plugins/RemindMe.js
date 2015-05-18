module.exports = function(bot) {
    var self = {
        name: 'RemindMe'
    };

    var pattern = /^remind me in ([0-9]+) (min|minutes|hours):? (.*)/i;

    self.parseMessage = function(string) {
        var query = pattern.exec(string);
        var result = {
            time: parseInt(query[1]) * 1000 * 60,
            message: query[3]
        };
        if (query[2] === 'hours') {
            result.time = result.time * 60;
        }
        return result;
    };

    self.setReminder = function(from, reminder) {
        bot.send({
            jid: from,
            message: 'Reminder noted.'
        });

        setTimeout(function() {
            bot.send({
                jid: from,
                message: 'Reminding you: ' + reminder.message
            });
        }, reminder.time);
    };

    bot.wobot.onPrivateMessage(function(from, message) {
        if (pattern.test(message)) {
            self.setReminder(from, self.parseMessage(message));
        }
    });

    return self;
};
