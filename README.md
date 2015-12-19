# Features

- Desktop notifications when someone joins
- Set custom welcome messages

# Quick Start

Create a `.env` file

```
NODE_ENV=development
LCTV_USERNAME=vutran
LCTV_PASSWORD=this_is_your_password
```

Run `npm install && npm start`

Type `!start` in chat room.

# Commands

#### `!start`

Starts the Bot

#### `!help`

Displays the help.

#### `!github-link`

Displays the link to the project.

#### `!set-welcome-message <message>`

Sets a new custom welcome message for users

**Params**
 - `%user` - The username of the person that just joined

# API

## Client

`Client.connect()`

`Client.say(message)`

`Client.send(stanza, debug)`

`Client.start()`

### node-xmpp Events

`online`

`connect`

`disconnect`

`reconnect`

`error`

`stanza`


### Custom Events

`lctv:cmd`

`lctv:cmd:admin`

`lctv:presence`

`lctv:message`

`lctv:iq`
