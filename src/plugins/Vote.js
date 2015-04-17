var _ = require('lodash');
var debug = require('debug')('plugin:vote');

/**
* The vote plugin, a simple register voting.
* @param {Object} bot The bot object as defined by the package wobot.
*/
var Vote = function(bot) {
    self = {
        name: 'Vote',
        polls: []
    };

    bot.onMessage(function(channel, from, message){
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
    }

    /**
     * Called when someones wants to vote for something.
     * @param {String} message The message as plain text.
     */
    self.vote = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        if (!self.polls[name]) {
            bot.message(channel, 'The requested poll ' + name + ' is currently not available, please try again later. (after you made it...)');
        } else {
            if (/yes|aye|1/.test(stripped[1])) {
                self.polls[name].yes++;
                bot.message(channel, 'Your vote has been registered for ' + name + '!');
            } else if (/no|0/.test(stripped[1])) {
                self.polls[name].no++;
                bot.message(channel, 'You vote has been registered ' + name + '!');
            } else {
                bot.message(channel, 'Either say \'yes\', \'aye\', \'1\' to vote yes, or \'no\', \'0\' to vote no');
            }
        }
        debug('a new vote');
    }

    /**
     * Called when someones wants the current poll standings.
     * @param {String} message The message as plain text.
     */
    self.poll = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        if (!self.polls[name]) {
            bot.message(channel, '404 ' + name + ' not found.');
        } else {
            var result = self.polls[name];
            bot.message(channel,
                'The current score for: ' + name + ' are: ' + result.yes + ' voted yes and ' + result.no + ' voted no.');
        }
    }

    /**
     * Called when someones wants to start a new poll.
     * @param {String} message The message as plain text.
     */
    self.startPoll = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        if (!name) {
            bot.message(channel, 'You must pass a name when creating a new poll.');
        } else {
            self.polls[name] = {
                yes: 0,
                no: 0
            };
            bot.message(channel, 'Created the new poll ' + name + '.');
        }
        debug('starting a new poll');
    }

    /**
     * Called when someones wants to end a poll.
     * @param {String} message The message as plain text.
     */
    self.endPoll = function(channel, from, message) {
        var stripped = clean(_.pluck(self.listeners, 'pattern'), message).split(' ');
        var name = stripped[0];
        if (!self.polls[name]) {
            bot.message(channel, 'Thou shall not end a poll which does not exists!');
        } else {
            var result = self.polls[name];
            bot.message(channel,
                'Results are are here!' + result.yes + ' voted yes and ' + result.no + ' voted no.');
            delete self.polls[name];
        }
        debug('ending a poll');
    }
    return self;
};
module.exports = Vote;
