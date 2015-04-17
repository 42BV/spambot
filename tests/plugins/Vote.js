var Vote = require('../../src/plugins/Vote.js');
var vote;
describe('Vote', function() {
    beforeEach(function() {
        vote = new Vote({
            onMessage: function() {},
            message: function() {}
        });
    })
    describe('onMessage', function() {
        it('should call the correct function', function(done){
            vote.startPoll = function(){
                done();
            };

            vote.onMessage(null, null, '!poll start ');
        });
    });
    describe('start poll', function() {
        it('should create a new poll', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.polls.should.have.property('theAwesomePollName');
            vote.polls['theAwesomePollName'].yes.should.be.equal(0);
            vote.polls['theAwesomePollName'].no.should.be.equal(0);
        });
        it('should do nothing when no name has been given', function() {
            vote.startPoll(null, null, '!poll start ');
            vote.polls.should.have.lengthOf(0);
        })
    });
    describe('should register a vote properly', function() {
        it('should register yes', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.vote(null, null, '!vote theAwesomePollName yes');
            vote.polls['theAwesomePollName'].yes.should.be.equal(1);
        });
        it('should register no', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.vote(null, null, '!vote theAwesomePollName no');
            vote.polls['theAwesomePollName'].no.should.be.equal(1);
        });
        it('should do nothing when neither is given', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.vote(null, null, '!vote theAwesomePollName asd');
            vote.polls['theAwesomePollName'].no.should.be.equal(0);
            vote.polls['theAwesomePollName'].yes.should.be.equal(0);
        });
    });
    describe('end poll', function() {
        it('should properly stop a poll', function() {
            vote.startPoll(null, null, '!poll start theAwesomePollName');
            vote.endPoll(null, null, '!poll end theAwesomePollName');
            vote.polls.should.have.lengthOf(0);
        })
    })
});
