var Bot = require('../src/bot.js');
var bot;
var hipchatter = {};
var wobot = {
    getRooms: function(cb) {
        cb(null, [['room1']]);
    }
};
describe('bot', function() {
    beforeEach(function() {
        bot = new Bot(wobot, hipchatter);
    });
    describe('#send', function() {
        it('should throw when message is not set', function() {

        });
        it('should throw when jid and id are not set', function() {

        });
        it('should call hipchatter:notify when htlm or color is set', function() {

        });
        it('should call wobot message in other cases', function() {

        });
    });
    describe('#setRooms', function() {
        it('should set the rooms', function(done) {
            bot.setRooms()
                .then(function(){
                    bot.rooms.should.have.lengthOf(1);
                    bot.rooms[0].should.equal('room1');
                    done();
                }, done)
                .done();
        });
    });
});
