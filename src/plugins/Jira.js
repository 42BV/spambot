var JiraApi = require('jira').JiraApi;
var debugErr = require('debug')('plugin:jira:error');
var _ = require('lodash');
var Q = require('q');
var config = require('config');

module.exports = function(bot) {
    var jiraApi = new JiraApi(config.jira.protocol, config.jira.domain, config.jira.port, config.jira.username, config.password, 2);
    var issuePattern = /issue (\w+\-\w+)/i;
    var self = {
        name: 'jira'
    };

    /**
     * @param {String} channel
     * @return {null | String} the project for the given channel, if the code was not set it return null.
     */
    self.getCode = function(channel) {
        if (bot.roomSettings[channel] && bot.roomSettings[channel].code) {
            return bot.roomSettings[channel].code;
        }
        return null;
    };

    /**
     * @param {String} code The project code.
     * @return {RegExp} The reg exp object which checks for matching issue key.
     */
    self.issueRegExp = function(code) {
        return new RegExp(code + '-[a-zA-Z0-9]+', 'i');
    };

    /**
     * Makes a link for the issue key.
     * @param {String} channel
     * @param {String} issueKey
     */
    self.makeLink = function(channel, issueKey) {
        bot.send({
            jid: channel,
            message: 'Fetching that sexy link for ' + issueKey + '.'
        });
        Q.ninvoke(jiraApi, 'findIssue', issueKey)
            .then(function(issue) {
                var link = '<a href="https://jira.42.nl/browse/' + issueKey + '">' + issueKey + '</a>';
                var message = 'Where you guys talking about ' + link + '? Which is about ' + issue.fields.summary + '.';
                bot.send({
                    html: true,
                    jid: channel,
                    message: message
                });
            }, function(err) {
                var message;
                if (err === 'Invalid issue number.') {
                    message = 'It seems you were talking about ' + issueKey + ' but that is an invalid issue key :/.';
                } else {
                    message = 'I tried to retrieve information about ' + issueKey + ' but something went wrong :(.';
                    debugErr('Failed retrieving %s, the error says: %s.', issueKey, err);
                }
                bot.send({
                    jid: channel,
                    message: message
                });
            }).done();
    };

    /**
     * @return {String} a table for the given issues as returned by JiraApi.searchJira.
     */
    self.makeTable = function(issues) {
        var head = '<thead><tr><td>Key</td><td>Summary</td><td>Status</td><tr></thead>';
        var rows = '<tbody><tr>' + _.map(issues, function(issue) {
            var key = '<td><a href="https://jira.42.nl/browse/' + issue.key + '">' + issue.key + '</a></td>';
            var description = '<td>' + issue.fields.summary + '</td>';
            var status = '<td>' + issue.fields.status.name + '</td>';
            return '<tr>' + key + description + status + '</td>';
        }).join('</tr><tr>') + '</tr></tbody>';
        return '<table>' + head + rows + '</table>';
    };

    /**
     * Sends a table with the last closed or resolved issues.
     * @param {String} channel
     */
    self.issuesDone = function(channel) {
        if (self.getCode(channel)) {
            Q.ninvoke(jiraApi, 'searchJira', 'project in ("' + self.getCode(channel) + '") AND (status in (closed, resolved) OR resolutiondate >= -1d) ORDER BY Rank ASC', {
                maxResults: 5
            }).then(function(response) {
                bot.send({
                    html: true,
                    jid: channel,
                    message: self.makeTable(response.issues)
                });
            }, function(err) {
                debugErr('Failed to retrieve the issues, the error said %j.', err);
                bot.send({
                    jid: channel,
                    message: 'An error occured when retrieving the issues.'
                });
            });
        } else {
            bot.send({
                jid: channel,
                message: 'Set the code before asking, you can do this with \'set code to UAS\' for example.'
            });
        }
    };

    bot.onMessage(function(channel, from, message) {
        var projectCode = self.getCode(channel);
        if (/what did we do/i.test(message)) {
            self.issuesDone(channel);
        } else if (projectCode && self.issueRegExp(projectCode).test(message)) {
            self.makeLink(channel, self.issueRegExp(projectCode).exec(message)[0]);
        } else if (issuePattern.test(message)) {
            self.makeLink(channel, issuePattern.exec(message)[1]);
        }
    });

    return self;
};
