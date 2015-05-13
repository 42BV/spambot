var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');
var jiraApiStubs = {
    findIssue: function(key, cb) {
        cb(new Error('not overriden'));
    }
};
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
    describe('onMessage', function() {
        var invokeCb;
        beforeEach(function() {
            bot.onMessage = function(cb) {
                invokeCb = cb;
            };
            jira = new Jira(bot);
        });
        it('should call issueDone when message is "what did we do".', function() {
            var spy = sinon.spy(jira, 'issuesDone');
            invokeCb(null, null, '!bot What did we do?');
            spy.calledOnce.should.be.ok;
        });
        it('should call make link when there is a project setting and the issue key matches', function() {
            bot.roomSettings['test channel'] = {
                code: 'TEST'
            };
            var spy = sinon.spy(jira, 'makeLink');
            invokeCb('test channel', null, 'some random, hey TEST-1, text');
            spy.calledWith('test channel', 'TEST-1').should.be.ok;
        });
        it('should call make link when someone uses the issue pattern', function() {
            var spy = sinon.spy(jira, 'makeLink');
            invokeCb('test channel', null, 'some random, hey issue TEST-1, text');
            spy.calledWith('test channel', 'TEST-1').should.be.ok;
        });
        it('should do nothing when project setting is not set and they are not using issue pattern', function() {
            var spy = sinon.spy(jira, 'makeLink');
            invokeCb('test channel', null, 'some random, hey TEST-1, text');
            spy.called.should.fail;
        });
    });
    describe('#makeLink', function() {
        it('should send a nice linky when the issue is found', function(done) {
            bot.send = sinon.spy();
            var matchFirstCall = sinon.match({
                jid: 'channel',
                message: sinon.match(/fetching that sexy/i)
            });
            var matchSecondCall = sinon.match({
                jid: 'channel',
                html: true,
                message: sinon.match(/where you guys talking/i)
            });
            bot.send.withArgs(matchFirstCall);
            bot.send.withArgs(matchSecondCall);
            jiraApiStubs.findIssue = function(key, cb) {
                cb(null, {
                    fields: {
                        summary: 'short description'
                    }
                });
            };
            jira.makeLink('channel', 'TEST-1')
                .then(function(){
                    bot.send.calledTwice.should.be.ok;
                    bot.send.withArgs(matchFirstCall).calledOnce.should.be.ok;
                    bot.send.withArgs(matchSecondCall).calledOnce.should.be.ok;
                    done();
                }, done).done();
        });
        it('should state when an issue is not found that is invalid', function(done) {
            var err = 'Invalid issue number.';
            bot.send = sinon.spy();
            var matchFirstCall = sinon.match({
                jid: 'channel',
                message: sinon.match(/fetching that sexy/i)
            });
            var matchSecondCall = sinon.match({
                jid: 'channel',
                html: true,
                message: sinon.match(/where you guys talking/i)
            });
            bot.send.withArgs(matchFirstCall);
            bot.send.withArgs(matchSecondCall);
            jiraApiStubs.findIssue = function(key, cb) {
                cb(err);
            };
            jira.makeLink('channel', 'TEST-1')
                .then(function(){
                    done('should not succeed');
                }, function(error){
                    error.should.equal(err);
                    done();
                }).done();
        });
        it('should state that an error occured when the issue fetching went wrong', function(done){
            bot.send = sinon.spy();
            var matchFirstCall = sinon.match({
                jid: 'channel',
                message: sinon.match(/fetching that sexy/i)
            });
            var matchSecondCall = sinon.match({
                jid: 'channel',
                html: true,
                message: sinon.match(/where you guys talking/i)
            });
            bot.send.withArgs(matchFirstCall);
            bot.send.withArgs(matchSecondCall);
            jiraApiStubs.findIssue = function(key, cb) {
                cb(new Error('smh'));
            };
            jira.makeLink('channel', 'TEST-1')
                .then(function(){
                    done('should not succeed');
                }, function(error){
                    error.should.match(/I tried to retrieve information/i);
                    done();
                }).done();
        });
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
