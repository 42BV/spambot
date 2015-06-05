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
