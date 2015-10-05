# Spambot [![Build Status](https://travis-ci.org/42BV/spambot.svg?branch=master)](https://travis-ci.org/42BV/spambot)
HipChat bot listening to webhooks and xmpp events and able to send instructions to HipChat via the http api or the xmpp.

# Install
```git clone https://github.com/42BV/spambot.git```  
```npm install``` 

# Usage 
Create a ```default.json``` file under config. You can check the [example](config/test.json) file for which attributes should be set.  
To get the jid of the bot, go to the [xmpp](https://www.hipchat.com/account/xmpp) page of hipchat.  
For the api key, navigate to the [api](https://www.hipchat.com/account/api) page.

When the config file is set correctly run ```node src/app.js```.

# Plugin based
The app is plugin based, that means that you can easily write your own plugin if you want. See the [plugins](src/plugins) for more information.

# Commands
Some plugins only work in private chats, some only in group chats and some in both. Here is an overview of all possible commands that are currently installed.

## Group only commands
`set X to Y` Sets the property X with value Y in the current chanel. Some plugins require this.  
`!gifme keywords` Searches up a gif matching the keywords, you can also do `!gifme random keywords` if you don't want the top result. SFW is enabled here, I\'m sorry, you can file a PR if you want to change it.  
`issue XXXX-123` Will give you a link to the issue, if you set the `code` property in the channel you can just reference it with: `blalbla TEST-301 blabla`.
`what did we do` When to channel `code` property is set, will give you the last 5 resolved/closed issues.   
`!poll start/end name` will start or stop a poll with the given name.  
`!vote name yes|no` will vote yes or no for the poll with the given name.  

## Private only commands
`remind me in X min/minutes/hours: message` Will remind you after X minutes or hours the message.

License
-------
 Copyright 2011-2014 42BV (http://www.42.nl)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
