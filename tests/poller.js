var Poller = require('../src/poller.js');

describe('poller', function() {
    var poller;
    var getMessage = function() {};
    var process = function() {};
    beforeEach(function() {
        poller = new Poller(3, getMessage, process);
    })
    describe('#cleanMessage', function() {
        var messages = [{
            id: 1,
            message: 'hi'
        }, {
            id: 2,
            message: 'hi'
        }, {
            id: 3,
            message: 'hi'
        }];
        it('should return the full list', function() {
            var result = poller._cleanMessages(messages);
            result.should.be.lengthOf(3);
            poller.lastId.should.equal(3)
        });
        it('should return an empty list on second run', function(){
            poller._cleanMessages(messages);
            var result = poller._cleanMessages(messages);
            result.should.be.lengthOf(0);
        });
        it('should return non empty list after an element is added.', function(){
            poller._cleanMessages(messages);
            messages.push({
                id: -1,
                messages: 'new!'
            });
            var result = poller._cleanMessages(messages);
            result.should.be.lengthOf(1);
            poller.lastId.should.equal(-1);
        });
    });
});
