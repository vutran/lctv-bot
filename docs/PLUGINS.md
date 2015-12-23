# Plugins

### `EchoPlugin`

Prints the entered message back to the room.

### `GitHubPlugin`

Prints the link to the GitHub repository of the project.

### `HelpPlugin`

Displays a list of available commands. For more information regarding a specific command, type `!help <command>`

### `ProjectPlugin`

Prints the project information.

### `PronouncePlugin`

Sets a new pronunciation for a specified user.

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

### `GreetPlugin`

Adds a greeting message every time a user enters the chat room.

### `JokesPlugin`

Print a random Chuck Norris joke.

### `MentionsPlugin`

Display a desktop notification when someone mentions your username.

### `WolframPlugin`

Seek an answer? Look it up.

# How To Write Your Own Plugin

Writing a plugin is very easy. Take this simple Hello World plugin for example.

The example plugin below will create a new command with `bot.createCommand()` called `!test` which will make the bot print out the given message into the room with `bot.say()`

```javascript

// path/to/MyPlugin.js
export default function(bot) {

  bot.createCommand('test', 'This is the description of the command.', (cmd, args, stanza) => {
    bot.say('This is printed to the channel.')
  })
}
```

You can even pass arguments when creating a command.

The example below uses the `args` parameter to determine what to say to the room. Example: `!name first` will display "Vu" while `!name last` will display "Tran".

```javascript
bot.createCommand('name', 'This is the description of the command.', (cmd, args, stanza) => {
  switch(args[0]) {
    case 'first':
      bot.say('Vu')
      break
    case 'last':
      bot.say('Tran')
      break
  }
})
```

You can create alias too by sending an array as the first parameter into `bot.createCommand()`

```javascript
bot.createCommand(['alias1', 'alias2'], 'description...', (cmd, args, stanza) => {
  // .. your script here...
})
```

# Loading a Plugin

Just `import` or `require()` your plugin into your Bot.

```javascript
import MyPlugin from './path/to/MyPlugin'

const MyOtherPlugin = require('./path/to/MyOtherPlugin')

new Bot({
  // ... your bot configurations,
  // Add your plugin to the "plugins" property
  plugins: [ MyPlugin, MyOtherPlugin ]
})
```
