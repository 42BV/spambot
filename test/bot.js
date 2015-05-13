var Bot = require('../src/bot.js');
var sinon = require('sinon');
var bot;
var hipchatter = {
    notify: function(roomId, options, cb) {
        cb(null, {
            id: roomId,
            options: options
        });
    }
};
var wobot = {
    onMessage: function() {},
    getRooms: function(cb) {
        cb(null, [
            [{
                jid: 'room1',
                id: 1
            }]
        ]);
    }
};
describe('bot', function() {
    beforeEach(function() {
        bot = new Bot(wobot, hipchatter);
    });
    describe('#onMessage', function() {
        it('invoke wobot:onMessage on the argument', function() {
            var f = function(){};
            wobot.onMessage = sinon.spy();
            bot.onMessage(f);
            wobot.onMessage.calledWith(f).should.be.ok;
        });
    });
    describe('#send', function() {
        it('should throw when message is not set', function() {
            (function() {
                bot.send({});
            }).should.throw(/bot:send expects message/);
        });
        it('should throw when jid and id are not set', function() {
            (function() {
                bot.send({
                    message: 'message'
                });
            }).should.throw(/bot:send expects either/);
        });
        it('should call hipchatter:notify when html or color is set (with jid)', function(done) {
            bot.setRooms()
                .then(function() {
                    return bot.send({
                        jid: 'room1',
                        message: 'message',
                        html: true
                    });
                })
                .then(function(result) {
                    result.should.have.property('id').with.equal(1);
                    done();
                }, done).done();
        });
        it('should call hipchatter:notify when html or color is set (with roomId)', function(done) {
            bot.send({
                roomId: 'awesome',
                message: 'message',
                html: true
            })
                .then(function(result) {
                    result.should.have.property('id').with.equal('awesome');
                    done();
                }, done).done();
        });
        it('should call wobot message in other cases (with jid)', function() {
            wobot.message = sinon.spy();
            bot.send({
                jid: 'room1',
                message: 'message'
            });
            wobot.message.calledWith('room1', 'message');
        });
        it('should call wobot message in other cases (with roomId)', function(done) {
            bot.setRooms()
                .then(function() {
                    wobot.message = sinon.spy();
                    bot.send({
                        roomId: 1,
                        message: 'message'
                    });
                    wobot.message.calledWith('room1', 'message');
                    done();
                }, done);
        });
    });
    describe('#setRooms', function() {
        it('should set the rooms', function(done) {
            bot.setRooms()
                .then(function() {
                    bot.rooms.should.have.lengthOf(1);
                    bot.rooms.should.be.Array;
                    done();
                }, done)
                .done();
        });
    });
});
