var sinon = require('sinon');
var proxyquire = require('proxyquire');
describe('manager', function() {
    it('should require all the plugins in the specified directory', function() {
        var vote = sinon.spy();
        var bot = {
            test: true
        };
        proxyquire('../src/manager.js', {
            fs: {
                readdirSync: function() {
                    return ['Vote.js', 'smh.unknown', 'as'];
                }
            },
            './plugins/Vote.js': vote
        })(bot);
        vote.calledWith(bot).should.be.ok;
    });
});
