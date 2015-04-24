var _ = require('lodash');
var debug = require('debug')('plugin:vote');

/**
 * The vote plugin, a simple register voting.
 * @param {Object} bot The bot interface.
 */
var Vote = function(bot) {
    var self = {
        name: 'Vote',
        polls: []
    };

    bot.onMessage(function(channel, from, message) {
        self.onMessage(channel, from, message);
    });

    self.listeners = [{
        pattern: /^(!vote )(?!end)/,
        callback: 'vote'
    }, {
        pattern: /^(!poll )(?!end|!?start)/,
        callback: 'poll'
    }, {
        pattern: /^(!poll end )/,
        callback: 'endPoll'
    }, {
        pattern: /^(!poll start )/,
        callback: 'startPoll'
    }];

    /**
     * Called when bot emits 'onMessage'.
     * @param {String} channel The channel id.
     * @param {String} from The user that said the message.
     * @param {String} message The message.
     */
    self.onMessage = function(channel, from, message) {
        var listener = _.find(self.listeners, function(listener) {
            return listener.pattern.test(message);
        });

        if (listener) {
            self[listener.callback](channel, from, message);
        }
    };

    /**
     * Removes the begin pattern from the message.
     * @param {Array} patters An array of regexs.
     * @param {String} message The message to be cleaned.
     * @return {String} the message without the regex.
     */
    var clean = function(patterns, message) {
        var match = _.find(patterns, function(p) {
            return p.test(message);
        });
        return message.replace(match, '');
    };

    /**
     * Called when someones wants to vote for something.
     * @param {String} message The message as plain text.
     */
    self.vote = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        var response;
        if (!self.polls[name]) {
            response = 'The requested poll ' + name + ' is currently not available, please try again later. (after you made it...)';
        } else {
            if (/yes|aye|1/.test(stripped[1])) {
                self.polls[name].yes++;
                response = 'Your vote has been registered for ' + name + '!';
            } else if (/no|0/.test(stripped[1])) {
                self.polls[name].no++;
                response = 'You vote has been registered ' + name + '!';
            } else {
                response = 'Either say \'yes\', \'aye\', \'1\' to vote yes, or \'no\', \'0\' to vote no';
            }
        }
        bot.send({
            jid: channel,
            message: response
        });
    };

    /**
     * Called when someones wants the current poll standings.
     * @param {String} message The message as plain text.
     */
    self.poll = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        var response;
        if (!self.polls[name]) {
            response = '404 ' + name + ' not found.';
        } else {
            var result = self.polls[name];
            response = 'The current score for: ' + name + ' are: ' + result.yes + ' voted yes and ' + result.no + ' voted no.';
        }
        bot.send({
            jid: channel,
            message: response
        });
    };

    /**
     * Called when someones wants to start a new poll.
     * @param {String} message The message as plain text.
     */
    self.startPoll = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        var response;
        if (!name) {
            response = 'You must pass a name when creating a new poll.';
        } else if (self.polls[name]) {
            response = 'There is already a poll with the name ' + name + '.';
        } else {
            self.polls[name] = {
                yes: 0,
                no: 0
            };
            response = 'Created the new poll ' + name + '.';
        }
        bot.send({
            jid: channel,
            message: response
        });
    };

    /**
     * Creates the ending message for poll.
     * @param {Array | Object} poll The results of the poll.
     * @param {String} name The name of the poll.
     * @return {String} the message to be send to the room.
     */
    var createMessage = function(poll, name) {
        var message = 'The results are in for ' + name + '!<br/>';
        return message + poll.yes + ' Voted yes and ' + poll.no + ' voted no.';
    };

    /**
     * Called when someones wants to end a poll.
     * @param {String} message The message as plain text.
     */
    self.endPoll = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        if (!self.polls[name]) {
            bot.send({
                jid: channel,
                message: 'Thou shall not end a poll which does not exists!'
            });
        } else {
            bot.send({
                jid: channel,
                html: true,
                color: 'random',
                message: createMessage(self.polls[name], name)
            }).then(function() {}, function(error) {
                debug('Failed to end the poll. The error was %j.', error);
            });
            delete self.polls[name];
        }
    };

    return self;
};

module.exports = Vote;
