var RemindMe = require('../../src/plugins/RemindMe.js');
var remindMe;
var sinon = require('sinon');

var invokeCB;
var bot = {
    wobot: {
        onPrivateMessage: function(cb) {
            invokeCB = cb;
        }
    },
    send: function() {}
};

describe('RemindMe', function() {
    beforeEach(function() {
        remindMe = new RemindMe(bot);
    });
    describe('onPrivateMessage', function() {
        it('should not call setReminder when the pattern does not match', function() {
            remindMe.setReminder = sinon.spy();
            invokeCB(null, '!remind me in 10 min that this test fails');
            remindMe.setReminder.notCalled.should.be.ok;
        });
        it('should call setReminder when the patter matches', function() {
            remindMe.setReminder = sinon.spy();
            invokeCB(null, 'remind me in 10 min that this test fails');
            remindMe.setReminder.called.should.be.ok;
        });
    });
    describe('#parseMessage', function() {
        it('should parse and set the time to minutes', function() {
            var result = remindMe.parseMessage('remind me in 3 minutes that this test is awesome.');
            result.should.have.property('time').with.equal(3 * 1000 * 60);
            result.should.have.property('message').with.equal('that this test is awesome.');
        });
        it('should parse and set the time to hours', function() {
            var result = remindMe.parseMessage('remind me in 3 hours that this test is awesome.');
            result.should.have.property('time').with.equal(3 * 1000 * 60 * 60);
            result.should.have.property('message').with.equal('that this test is awesome.');
        });
    });
    describe('#setReminder', function() {
        it('should call bot.send twice', function(done) {
            bot.send = sinon.spy();
            var interval = 100;
            remindMe.setReminder('me', {
                time: 100,
                message: 'test'
            });
            setTimeout(function() {
                bot.send.calledTwice.should.be.ok;
                done();
            }, interval);
        });
    });
});
