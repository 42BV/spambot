var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');
var jiraApiStubs = {};
var Jira = proxyquire('../../src/plugins/Jira.js', {
    jira: {
        JiraApi: function() {
            return jiraApiStubs;
        }
    }
});
var bot = {
    roomSettings: {},
    onMessage: function() {},
    send: function() {}
};
var jira;
describe('jira', function() {
    beforeEach(function() {
        bot.roomSettings = {};
        jira = new Jira(bot);
    });
    describe('#getCode', function() {
        it('should return null when roomSetting for the channel is not set', function() {
            should(jira.getCode('channel')).be.exactly(null);
        });
        it('should return null when the code for the channel is not set', function() {
            bot.roomSettings.channel = {};
            should(jira.getCode('channel')).be.exactly(null);
        });
        it('should return the code', function() {
            bot.roomSettings.channel = {
                code: 'test'
            };
            jira.getCode('channel').should.be.equal('test');
        });
    });
    describe('#issueRegExp', function() {
        it('should return a regexp object', function() {
            jira.issueRegExp().should.be.instanceOf(RegExp);
        });
    });
    describe('#makeTable', function() {
        it('should make a table', function() {
            jira.makeTable([{
                key: 'test-1',
                fields: {
                    summary: 'a short summary',
                    status: {
                        name: 'closed'
                    }
                }
            }]).should.be.instanceOf(String);
        });
    });
    describe('#issuesDone', function() {
        it('should send an error message when code is not set', function() {
            bot.send = sinon.spy();
            jira.issuesDone('channel');
            bot.send.calledWith({
                jid: 'channel',
                message: sinon.match(/Set the code/)
            }).should.be.ok;
        });
        it('should send an error message when searchJira fails', function(done) {
            jiraApiStubs.searchJira = function(query, options, cb) {
                cb(new Error('new error'));
            };
            bot.send = function(obj) {
                obj.should.have.property('message').with.match(/An error occured/);
                done();
            };
            bot.roomSettings.channel = {
                code: 'smh'
            };
            jira.issuesDone('channel');
        });
        it('should send an error message when searchJira fails', function(done) {
            jiraApiStubs.searchJira = function(query, options, cb) {
                cb(null, {
                    issues: [{
                        key: 'test-1',
                        fields: {
                            summary: 'a short summary',
                            status: {
                                name: 'closed'
                            }
                        }
                    }]
                });
            };
            jira.makeTable = sinon.spy();
            bot.send = function(obj) {
                obj.should.have.property('html').with.ok;
                jira.makeTable.calledOnce.should.be.ok;
                done();
            };
            bot.roomSettings.channel = {
                code: 'smh'
            };
            jira.issuesDone('channel');
        });
    });
});
