var Project = require('../../src/plugins/Project.js');
var project;
var sinon = require('sinon');
describe('project', function() {
    describe('onMessage', function() {
        it('should do nothing when the message does not match the pattern', function() {
            var invokeCb;
            var bot = {
                onMessage: function(cb) {
                    invokeCb = cb;
                },
                send: sinon.spy()
            };
            project = new Project(bot);
            invokeCb(null, null, 'smh random set project to 1');
            bot.send.called.should.fail;
        });
        it('should invoke bot:send and project:set', function() {
            var invokeCb;
            var bot = {
                onMessage: function(cb) {
                    invokeCb = cb;
                },
                roomSettings: [],
                send: sinon.spy()
            };
            project = new Project(bot);
            project.set = sinon.stub();
            project.set
                .withArgs('channel', 'set project to 1')
                .returns({
                    key: 'project',
                    value: 1
                });
            invokeCb('channel', null, 'set project to 1');
            bot.send.called.should.be.ok;
            project.set.calledOnce.should.be.ok;
        });
    });
    describe('#set', function() {
        it('should set the settings properly', function() {
            var bot = {
                roomSettings: [],
                onMessage: function() {}
            };
            project = new Project(bot);
            var result = project.set('channel', 'set awesome to true');
            var expected = {
                key: 'awesome',
                value: 'true'
            };
            result.should.eql(expected);
            bot.roomSettings.should.have.property('channel').with.eql({
                awesome: 'true'
            });
        });
    });
});
