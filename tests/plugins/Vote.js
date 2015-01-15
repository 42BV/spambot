var Vote = require('../../src/plugins/Vote.js');

describe('Vote', function() {
    var hipchatter = {
        notify: function() {}
    }
    var vote = new Vote(hipchatter, 'a room');
    describe('start poll', function() {
        it('should create a new poll', function(){
            vote.startPoll({
                message: '!poll start theAwesomePollName'
            });
            vote.polls.should.have.property('theAwesomePollName');
            vote.polls['theAwesomePollName'].yes.should.be.equal(0);
            vote.polls['theAwesomePollName'].no.should.be.equal(0);
        });
        it('should do nothing when no name has been given', function(){
            vote.startPoll({
                message: '!poll start '
            });
            vote.polls.should.have.lengthOf(0);
        })
    });
    describe('should register a vote properly', function(){
        it('should register yes', function(){
            vote.startPoll({
                message: '!poll start theAwesomePollName'
            });
            vote.vote({
                message: '!vote theAwesomePollName yes'
            });
            vote.polls['theAwesomePollName'].yes.should.be.equal(1);
        });
        it('should register no', function(){
            vote.startPoll({
                message: '!poll start theAwesomePollName'
            });
            vote.vote({
                message: '!vote theAwesomePollName no'
            });
            vote.polls['theAwesomePollName'].no.should.be.equal(1);
        });
        it('should do nothing when neither is given', function(){
            vote.startPoll({
                message: '!poll start theAwesomePollName'
            });
            vote.vote({
                message: '!vote theAwesomePollName asd'
            });
            vote.polls['theAwesomePollName'].no.should.be.equal(0);
            vote.polls['theAwesomePollName'].yes.should.be.equal(0);
        });
    });
    describe('end poll', function(){
        it('should properly stop a poll', function(){
            vote.startPoll({
                message: '!poll start theAwesomePollName'
            });
            vote.endPoll({
                message: '!poll end theAwesomePollName'
            });
            vote.polls.should.have.lengthOf(0);
        })
    })
});
