var Vote = function(hipchatter){
    this.listeners = [{
        pattern: '!vote',
        event: 'ON_MESSAGE'
    },{
        pattern:'!poll',
        event: 'ON_MESSAGE'
    }];
    this.polls = [];
    this.hipchatter = hipchatter;
}

Vote.prototype.onMessage = function(body){
    var message = body.item.message;
    polls.push({

    })
}


module.exports = Vote;