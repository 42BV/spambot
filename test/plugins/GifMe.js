var emptyResponse = '{"status":200,"meta":{"term":"r/filmgifsasdfasdfas","limit":1,"page":0,"total_pages":0,"total":0,"timing":"0.010s"},"data":[]}';
var fullResponse = '{"status":200,"meta":{"term":"yes","limit":1,"page":0,"total_pages":2762,"total":2762,"timing":"0.014s"},"data":[{"id":425,"origin":"http://i.imgur.com/m10O2yh.gif","score":0,"nsfw":false,"link":"http://i.imgur.com/m10O2yh.gif","thumb":"http://i.gifme.io/gifme/_a39b6f4ead180e979e17.gif","created_at":"2013-08-14T00:54:24.685Z","tags":["yes"]}]}';
var sinon = require('sinon');
var proxyquire = require('proxyquire').noPreserveCache();
var stubs = {
    request: function() {
        console.log('asdf');
    }
};
var bot = {
    onMessage: function() {},
    send: function() {}
};
var gifMe;

describe('GifMe', function() {
    describe('onMessage', function() {
        var invokeCb;
        beforeEach(function() {
            bot.onMessage = function(cb) {
                invokeCb = cb;
            };
            gifMe = proxyquire('../../src/plugins/GifMe.js', stubs)(bot);

        });
        it('should do nothing if the pattern does not match', function() {
            gifMe.gifme = sinon.spy();
            invokeCb(null, 'me', 'gifme compiling');
            gifMe.gifme.called.should.fail;
        });
        it('should call gifme once', function() {
            var spy = sinon.spy(gifMe, 'gifme');
            invokeCb(null, 'me', '!gifme compiling');
            spy.calledOnce.should.be.ok;
        });
    });
    describe('#gifme', function() {
        it('should return that an error occured', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    cb(new Error('an error'));
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/An error/);
                done();
            };
            gifMe.gifme(null, 'me', '!gifme compiling');
        });
        it('should return that there were no results', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    cb(null, null, emptyResponse);
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/No gifs/);
                done();
            };
            gifMe.gifme(null, 'me', '!gifme compiling');
        });
        it('should return an encoded url', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    cb(null, null, fullResponse);
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/http%3A%2F%2Fi.imgur.com%2Fm10O2yh.gif/);
                done();
            };
            gifMe.gifme(null, 'me', '!gifme compiling');
        });
    });
});
