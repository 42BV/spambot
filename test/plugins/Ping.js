var Ping = require('../../src/plugins/Ping.js');
var sinon = require('sinon');

var invokeMessage;
var invokePrivateMessage;
var bot = {
    onMessage: function(f) {
        invokeMessage = f;
    },
    wobot: {
        onPrivateMessage: function(f) {
            invokePrivateMessage = f;
        }
    },
    send: sinon.spy()
};

new Ping(bot);

describe('Ping', function() {
    it('should send pong when the message include ping', function() {
        invokeMessage('channel', null, 'some text ping some other text');
        bot.send.calledWith({
            jid: 'channel',
            message: 'pong'
        }).should.be.ok;
    });
    it('should do nothing when the message does not include ping', function() {
        invokeMessage('channel', null, 'some text some other text');
        bot.send.called.should.fail;
    });
    it('should send pong when a private message include ping', function() {
        invokePrivateMessage('channel2', 'some text ping some other text');
        bot.send.calledWith({
            jid: 'channel2',
            message: 'pong'
        }).should.be.ok;
    });
    it('should do nothing when a private message does not include ping', function() {
        invokePrivateMessage('channel', null, 'some text some other text');
        bot.send.called.should.fail;
    });
});
