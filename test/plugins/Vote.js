var Vote = require('../../src/plugins/Vote.js');
var sinon = require('sinon');
var vote;
var bot = {
    onMessage: function() {},
    message: function() {}
};
var hipchatter = {
    notify: function() {}
};
var manager = {
    rooms: []
};
describe('Vote', function() {
    beforeEach(function() {
        vote = new Vote(bot, hipchatter, manager);
    });
    describe('#onMessage', function() {
        it('should call the correct function', function(done) {
            vote.startPoll = function() {
                done();
            };

            vote.onMessage(null, null, '!poll start ');
        });
    });
    describe('#start poll', function() {
        it('should create a new poll', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.polls.should.have.property('theAwesomePollName');
            vote.polls.theAwesomePollName.yes.should.be.equal(0);
            vote.polls.theAwesomePollName.no.should.be.equal(0);
        });
        it('should do nothing when no name has been given', function() {
            vote.startPoll(null, null, '!poll start ');
            vote.polls.should.have.lengthOf(0);
        });
    });
    describe('#startPoll', function() {
        it('should register yes', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.vote(null, null, '!vote theAwesomePollName yes');
            vote.polls.theAwesomePollName.yes.should.be.equal(1);
        });
        it('should register no', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.vote(null, null, '!vote theAwesomePollName no');
            vote.polls.theAwesomePollName.no.should.be.equal(1);
        });
        it('should do nothing when neither is given', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.vote(null, null, '!vote theAwesomePollName asd');
            vote.polls.theAwesomePollName.no.should.be.equal(0);
            vote.polls.theAwesomePollName.yes.should.be.equal(0);
        });
    });
    describe('#endPoll', function() {
        it('should give an error when stopping a non-existing poll', function(){
            bot.message = sinon.spy();
            vote.endPoll('channel', null, '!poll end theAwesomePollName');
            bot.message.calledWith('channel', sinon.match(/Thou shall not/)).should.be.ok;
        });
        it('should properly stop a poll', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            hipchatter.notify = sinon.spy();
            manager.rooms.push({
                jid: 'channel',
                id: 1
            });
            vote.endPoll('channel', null, '!poll end theAwesomePollName');
            vote.polls.should.have.lengthOf(0);
            hipchatter.notify.calledWith(1).should.be.ok;
        });
    });
    describe('#poll', function() {
        it('Should give an error when the poll does not exists', function() {
            bot.message = sinon.spy();
            vote.poll('channel', null, '!poll test');
            bot.message.calledWith('channel', '404 test not found.').should.be.ok;
        });
        it('Should return the poll info', function() {
            vote.startPoll(null, null, '!poll start awesome');
            bot.message = sinon.spy();
            vote.poll('channel', null, '!poll awesome');
            bot.message.calledWith('channel', sinon.match(/The current score for/)).should.be.ok;
        });
    });
});
