# Features

- Desktop notifications
 - New user joins
 - Mentions for your username
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

Sets a new custom welcome message for users that joined for the first time.

**Params**
 - `%user%` - The username of the person that just joined

#### `!set-welcome-back-message <message>`

Sets a new custom welcome back message for users that has joined before.

**Params**
- `%user%` - The username of the person that just joined

# API

## Client

### Methods

`Client.connect()`

`Client.say(message)`

`Client.send(stanza, debug)`


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
