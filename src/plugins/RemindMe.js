/**
* A remind me plugin.
* Reminds the user after x minutes or hours the message that the user wants.
* For example: remind me in 3 min: yeah it works. Will send after 3 minutes the message: "yeah it works".
*/
module.exports = function(bot) {
    var self = {
        name: 'RemindMe'
    };

    var pattern = /^remind me in ([0-9]+) (min|minutes|hours):? (.*)/i;

    /**
    * Parses the messages and retrieves the minutes/hours and the message.
    * @param {String} string
    * @return {Object} containing the time and message.
    */
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

    /**
    * Sets the reminder.
    * @param {String} from The jid of an user.
    * @param {Object} reminder The reminder object, as returned by parseMessage.
    */
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
