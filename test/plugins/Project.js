var Project = require('../../src/plugins/Project.js');
var project;
describe('project', function() {
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
