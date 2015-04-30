# Plugin

All plugins are invoked with the [bot](../bot.js) interface. It has the hipchatter (http api) and the wobot (xmpp) exposed and already initialized. You can either hook on the xmpp (like onMessage, onInvite etc.), you can find all the events [here](../wobot.js).

A template for a plugin looks like this:  
```javascript
/**
 * The vote plugin, a simple register voting.
 * @param {Object} bot The bot interface.
 */
module.exports = function(bot){
    var self = {
        name: 'PluginName' // Used for debugging purposes
    };

    //For example if you want to hook on new messages
    bot.onMessage(function(channel, from, message){
        //Channel is the jid channel id
        //From is the jid of the user who wrote the message
    });

    //Sending a message, see bot.js for more information about the send function
    bot.send({
        html: true,
        color: 'random',
        messsage: 'Hello HipChat'
    });

    return self;
}
```
