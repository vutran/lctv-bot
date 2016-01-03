# Create a new Client

```javascript
const client = new Client({
  username: 'this is your LCTV username',
  password: 'this is your LCTV password'
})
```

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

```javascript
const bot = new Bot({
  client: client,
  channel: 'the name of the channel you wish to join',
  mentions: 'the username you wish to listen to for mentions',
  admins: 'the username that can execute admin commands',
  plugins: [] // a list of plugins to load
})


```

### Methods

`getName()`

Retrieves the name of the bot (used for desktop notifications).

`start()`

Starts the bot.

`join()`

Joins the channel.

`on(event, handler)`

Listen to an event, and runs the handler when emitted.

`createStore(name)`

Creates a new storage device

`retrieveUser(username, options, callback)`

Retrieve a new User instance (loads from the user store if already exists)

`retrieveUserFromStanza(stanza, callback)`

Retrieve a User instance from a stanza.

`saveUser(user)`

Saves the user to the user store.

`setContent(key, value)`

Sets the value for the given key.

`getMentionsFromValue(value)`

Retrieves a list of mentions.

`getUsers()`

Retrieves a list of online users.

**Content Keys**

|Key|Description|
|---|---|
|`botName`|The name of the bot. (Default: LCTV Bot)|

`getContent(key)`

Retrieves the value of the given key.

`createCommand(cmd, description, handler)`

Creates a new command.

`getCommands()`

Retrieve existing commands.

`speak(message)`

Speaks the message to the room (voice).

`say(mesasge)`

Prints the message to the room (text).

`notify(message)`

Displays a desktop notification.
