var debug = require('debug')('poller');
var debugErr = require('debug')('poller:error');
var _ = require('lodash');

/**
* Retrieves the next set of messages and removes the message from that that already are parsed.
* @param {Number} interval The interval on which he should call @code{getMessages}.
* @param {Function} getMessage The function which returns a promise and gets the next set of messages.
* @param {Function} process The callback to be called on each new messsage.
*/
module.exports = function(interval, getMessages, process) {
    var self = {
        lastId: null
    };

    /**
    * Removes all the messages that are already 'read'.
    * @param {Array} messages The next set of messages.
    * @return {Array} a set of messages that are not read.
    */
    self._cleanMessages = function(messages) {
        if (self.lastId === null) {
            self.lastId = messages[messages.length - 1].id;
            return messages;
        }

        var index = _.findIndex(messages, {id: self.lastId});
        messages = _.rest(messages, index + 1);

        if (messages.length !== 0) {
            self.lastId = messages[messages.length - 1].id;
        }
        return messages;
    }

    /**
    * Loops. Calls @code{getMessages} and removes all messages that are not already read and calls @code{process}.
    */
    self._looper = function() {
        console.log('next loop');
        getMessages().then(function(messages) {
            messages = self._cleanMessages(messages.items);
            _.each(messages, function(m) {
                process(m);
            });
        }, function(err) {
            console.error(err);
        }).then(function() {}, console.error);
    }

    /**
    * Starts calling @code{looper} at each @code{interval}.
    * @return {Number} the reference to the setInterval.
    */
    self.start = function() {
        self._looper();
        self.intervalId = setInterval(self._looper, interval * 1000);
        return self.intervalId;
    }

    /**
    * Stops the interval.
    */
    self.stop = function() {
        clearInterval(self.intervalId);
    }

    return self;
}
