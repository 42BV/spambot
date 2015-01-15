var _ = require('lodash');

var Vote = function(hipchatter, r) {
    this.listeners = [{
        pattern: /^(!vote )(?!end)/,
        event: 'message',
        callback: 'vote'
    }, {
        pattern: /^(!poll )(?!end|!?start)/,
        event: 'message',
        callback: 'poll'
    }, {
        pattern: /^(!poll end )/,
        event: 'message',
        callback: 'endPoll'
    }, {
        pattern: /^(!poll start )/,
        event: 'message',
        callback: 'startPoll'
    }];
    this.room = r;
    this.name = 'Vote';
    this.polls = [];
    this.hipchatter = hipchatter;
}

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
* @param {Object} message The object as described by the hipchat api.
*/
Vote.prototype.vote = function(message) {
    var stripped = clean(_.pluck(this.listeners, 'pattern'), message.message).split(' ');
    var name = stripped[0];
    if (!this.polls[name]) {
        this.hipchatter.notify(this.room, 'The requested poll ' + name + ' is currently not available, please try again later. (after you made it...)');
    } else {
        if (/yes|aye|1/.test(stripped[1])) {
            this.polls[name].yes++;
            this.hipchatter.notify(this.room, 'Your vote has been registered for ' + name + '!');
        } else if (/no|0/.test(stripped[1])) {
            this.polls[name].no++;
            this.hipchatter.notify(this.room, 'You vote has been registered ' + name + '!');
        } else {
            this.hipchatter.notify(this.room, 'Either say \'yes\', \'aye\', \'1\' to vote yes, or \'no\', \'0\' to vote no');
        }
    }
    console.log('a new vote');
}

/**
* Called when someones wants the current poll standings.
* @param {Object} message The object as described by the hipchat api.
*/
Vote.prototype.poll = function(message) {
    var stripped = clean(_.pluck(this.listeners, 'pattern'), message.message).split(' ');
    var name = stripped[0];
    if (!this.polls[name]) {
        this.hipchatter.notify(this.room, '404 ' + name + ' not found.');
    } else {
        var result = this.polls[name];
        this.hipchatter.notify(this.room,
            'The current score for: ' + name + ' are: ' + result.yes + ' voted yes and ' + result.no + ' voted no.');
    }
}

/**
* Called when someones wants to start a new poll.
* @param {Object} message The object as described by the hipchat api.
*/
Vote.prototype.startPoll = function(message) {
    var stripped = clean(_.pluck(this.listeners, 'pattern'), message.message).split(' ');
    var name = stripped[0];
    if (!name) {
        this.hipchatter.notify(this.room, 'You must pass a name when creating a new poll.');
    } else {
        this.polls[name] = {
            yes: 0,
            no: 0
        };
        this.hipchatter.notify(this.room, 'Created the new poll ' + name + '.');
    }
    console.log('starting a new poll');
}

/**
* Called when someones wants to end a poll.
* @param {Object} message The object as described by the hipchat api.
*/
Vote.prototype.endPoll = function(message) {
    var stripped = clean(_.pluck(this.listeners, 'pattern'), message.message).split(' ');
    var name = stripped[0];
    if (!this.polls[name]) {
        this.hipchatter.notify(this.room, 'Thou shall not end a poll which does not exists!');
    } else {
        var result = this.polls[name];
        this.hipchatter.notify(this.room,
            'Results are are here!' + result.yes + ' voted yes and ' + result.no + ' voted no.');
        delete this.polls[name];
    }
    console.log('ending a poll');
}

module.exports = Vote;
