var emptyResponse = '{"status":200,"meta":{"term":"r/filmgifsasdfasdfas","limit":1,"page":0,"total_pages":0,"total":0,"timing":"0.010s"},"data":[]}';
var fullResponse = '{"status":200,"meta":{"term":"yes","limit":1,"page":0,"total_pages":2762,"total":2762,"timing":"0.014s"},"data":[{"id":425,"origin":"http://i.imgur.com/m10O2yh 1.gif","score":0,"nsfw":false,"link":"http://i.imgur.com/m10O2yh 1.gif","thumb":"http://i.gifme.io/gifme/_a39b6f4ead180e979e17.gif","created_at":"2013-08-14T00:54:24.685Z","tags":["yes"]}]}';
var randomResponse = '{"status":200,"meta":{"term":"","timing":"0.048ms"},"gif":{"id":597395,"gif":"http://i.imgur.com/PbOZ1ek.png","thumb":"http://i.gifme.io/gifme/a49e077815.png"}}';
var sinon = require('sinon');
var proxyquire = require('proxyquire').noPreserveCache();
var stubs = {
    request: function() {}
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
        it('should call search once', function() {
            var spy = sinon.spy(gifMe, 'search');
            invokeCb(null, 'me', '!gifme compiling');
            spy.calledOnce.should.be.ok;
        });
        it('should call random once', function() {
            var spy = sinon.spy(gifMe, 'random');
            invokeCb(null, 'me', '!gifme random');
            spy.calledOnce.should.be.ok;
        });
    });
    describe('#random', function() {
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
            gifMe.random(null, 'me', '!gifme random');
        });
        it('should call request without "term"', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    url.should.not.match(/\&term\=/);
                    cb(new Error('an error'));
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/An error/);
                done();
            };
            gifMe.random(null, 'me', '!gifme random');
        });
        it('should call request "term"', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    url.should.match(/\&term\=smh/);
                    cb(new Error('an error'));
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/An error/);
                done();
            };
            gifMe.random(null, 'me', '!gifme random smh');
        });
        it('should return a link', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    cb(null, null, randomResponse);
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/http\:\/\/i.imgur.com\/PbOZ1ek.png/);
                done();
            };
            gifMe.random(null, 'me', '!gifme random smh');
        });
    });
    describe('#search', function() {
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
            gifMe.search(null, 'me', '!gifme compiling');
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
            gifMe.search(null, 'me', '!gifme compiling');
        });
        it('should return an encoded url', function(done) {
            gifMe = proxyquire('../../src/plugins/GifMe.js', {
                request: function(url, cb) {
                    cb(null, null, fullResponse);
                }
            })(bot);

            bot.send = function(msg) {
                msg.should.have.property('message').with.match(/http\:\/\/i.imgur.com\/m10O2yh%201.gif/);
                done();
            };
            gifMe.search(null, 'me', '!gifme compiling');
        });
    });
});
