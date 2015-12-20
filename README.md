# Features

- Desktop notifications
 - New user joins
 - Mentions for your username
- Set custom welcome messages

# Quick Start

Create a `.env` file

```
NODE_ENV=development
LCTV_USERNAME=this_is_your_username
LCTV_PASSWORD=this_is_your_password
LCTV_CHANNEL=this_is_the_channel_name_you_want_to_join
LCTV_MENTIONS=a_keyword_you_want_to_listen_to_for_notifications
LCTV_ADMINS=this_is_the_admin_username
```

Run `npm install && npm start`

Type `!start` in chat room.

# Commands

#### `!start`

Starts the Bot

#### `!help`

Displays the help.

#### `!githubLink`

Displays the link to the project.

#### `!setContent <key> <value>`

Updates the value for the given content string.

**Content Keys**

- **botName**
- **githubLink**
- **projectInfo**
- **welcomeMessage**
 - `%user%` - The username of the person that just joined
- **welcomeBackMessage**
 - `%user%` - The username of the person that just joined

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

`lctv:mentions`
