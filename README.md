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

# API

## Client

### Methods

`Client.connect()`

`Client.send(stanza, debug)`

`Client.join(channel)`

`Client.ping()`

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

`lctv:channel:join`

When a user joins the channel.

`lctv:mentions:all`

When any user is mentioned.

`lctv:mentions:self`

When someone mentions your username.

`lctv:follower:error`

`lctv:follower:new`

`lctv:follower:run`

`lctv:timer:tick`


## Bot

### Methods

`start()`

`join()`

`on(event, handler)`

Listen to an event, and runs the handler when emitted.

`createStore(name)`

Creates a new storage device

`createUser(username)`

Creates a new User instance (loads from the user store if already exists)

`saveUser(user)`

Saves the user to the user store.

`setContent(key, value)`

**Content Keys**

|Key|Description|
|---|---|
|`botName`|The name of the bot. (Default: LCTV Bot)|

`getContent(key)`

`createCommand(cmd, description, handler)`

`getCommands()`

`speak(message)`

`say(mesasge)`

`notify(message)`

# Plugins

### `EchoPlugin`

Prints the entered message back to the room.

### `GitHubPlugin`

Prints the link to the GitHub repository of the project.

### `HelpPlugin`

Displays a list of available commands. For more information regarding a specific command, type `!help <command>`

### `ProjectPlugin`

Prints the project information.

### `SayPlugin`

Says whatever the message is to the room.

### `SettingsPlugin`

Sets a general setting value.

### `StatusPlugin`

Sets your status to "away" or "available". If away, the bot will automatically reply when the user is mentioned.

### `ViewsPlugin`

Display the number of times you have visited the channel.

### `WebsitePlugin`

Prints the link to the project web site.

### `FollowersPlugin`

Adds a notification when you have a new follower.

### `WelcomePlugin`

Adds a welcome message every time a user enters the chat room.
