# Features

- Desktop notifications
 - New user joins
 - Mentions for your username
 - New followers
- Voice notifications
 - New user joins
 - New followers
- (Admin) Set custom welcome messages

# Quick Start

Create a `.env` file

```
NODE_ENV=development
LCTV_USERNAME=this_is_your_username
LCTV_PASSWORD=this_is_your_password
LCTV_CHANNEL=this_is_the_channel_name_you_want_to_join
LCTV_MENTIONS=a_keyword_you_want_to_listen_to_for_notifications
LCTV_ADMINS=this_is_the_admin_username
LCTV_FOLLOWERS_URL=this_is_the_url_to_your_followers_rss_feed
```

Run `npm install && npm start`

Type `!start` in chat room.

# Commands

#### `!start`

Starts the Bot

#### `!help [<command>]`

Displays the help.

#### `!githubLink`

Displays the link to the bot's GitHub project.

#### `!project`

Display the current project information.

#### `!setContent <key> <value>`

Updates the value for the given content string.

#### `!status <newStatus>`

Set your status to "away", or "available" to enable the automatic Bot replies when someone mentions you when you are away.

#### `!views`

This will display how many times you have logged in to view the channel/stream.

**Content Keys**

- **botName**
- **githubLink**
- **projectInfo**
- **welcomeMessage**
 - `%user%` - The username of the person that just joined.
- **welcomeBackMessage**
 - `%user%` - The username of the person that just joined.
- **newFollowerMessage**
- `%user%` - The username who just followed you.


# API

## Client

### Methods

`Client.connect()`

`Client.send(stanza, debug)`

`Client.join(channel)`

`Client.say(message)`


### Events

`online`

`connect`

`disconnect`

`reconnect`

`error`

`stanza`

`lctv:cmd`

`lctv:cmd:admin`

`lctv:presence`

`lctv:message`

`lctv:iq`

`lctv:mentions:all`

`lctv:mentions:self`

`lctv:follower:error`

`lctv:follower:new`

`lctv:follower:run`


## Bot

### Methods

`start()`

`join()`

`createUser()`

`saveUser()`
