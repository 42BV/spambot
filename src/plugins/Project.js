module.exports = function(bot) {
    var self = {
        name: 'project',
        pattern: /^set ([a-zA-Z][a-zA-Z0-9]*) to ([a-zA-Z0-9]+)/
    };

    /**
    * Sets a room setting.
    * @param {String} channel The channel in which the settings should be set.
    * @param {String} message The message containing the key value pair.
    * @return {Object} value key pair extracted from the pattern.
    */
    self.set = function(channel, message) {
        var match = self.pattern.exec(message);
        var setted = {
            key: match[1],
            value: match[2]
        };
        if (!bot.roomSettings[channel]) {
            bot.roomSettings[channel] = {};
        }
        bot.roomSettings[channel][setted.key] = setted.value;
        return setted;
    };

    bot.onMessage(function(channel, from, message) {
        if (self.pattern.test(message)) {
            var setted = self.set(channel, message);
            bot.send({
                jid: channel,
                message: 'Succesfull set ' + setted.key + ' to ' + setted.value + ' for this room.'
            });
        }
    });
    return self;
};
