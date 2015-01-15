var Vote = function(hipchatter){
    this.listeners = [{
        pattern: /^(!vote )(?!end)/,
        event: 'message',
        callback: 'vote'
    },{
        pattern: /^(!poll)/,
        event: 'message',
        callback: 'poll'
    },{
        pattern: /^(!poll end)/,
        event: 'message',
        callback: 'endPoll'
    },{
        pattern: /^(!poll start)/,
        event: 'message',
        callback: 'startPoll'
    }];
    this.name = 'Vote';
    this.polls = [];
    this.hipchatter = hipchatter;
}

var clean = function(string, pattern){
}

Vote.prototype.vote = function(message){
    console.log('a new vote');
}


Vote.prototype.poll = function(message){
    console.log('retrieving poll info');

}


Vote.prototype.startPoll = function(message){
    console.log('starting a new poll');

}


Vote.prototype.endPoll = function(message){
    console.log('ending a poll');

}

module.exports = Vote;
