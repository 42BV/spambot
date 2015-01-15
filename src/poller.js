var debug = require('debug')('poller');
var debugErr = require('debug')('poller:error');
var _ = require('lodash');
module.exports = function(interval, getMessages, process) {
    var self = {
        lastId: null
    };

    self._cleanMessages = function(messages) {
        if (self.lastId === null) {
            self.lastId = messages[messages.length - 1].id;
            return messages;
        }
        var index = 0;
        messages.some(function(message, i) {
            if (message.id === self.lastId) {
                index = i;
                return true;
            }
        });
        messages = _.rest(messages, index + 1);
        if (messages.length !== 0) {
            self.lastId = messages[messages.length - 1].id;
        }
        return messages;
    }

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

    self.start = function(process) {
        return setInterval(self._looper, interval * 1000);
    }

    return self;
}
