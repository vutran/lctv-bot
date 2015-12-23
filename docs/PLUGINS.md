# How To Write Your Own Plugin

Writing a plugin is very easy. Take this simple Hello World plugin for example.

The example plugin below will create a new command with `bot.createCommand()` called `!test` which will make the bot print out the given message into the room with `bot.say()`

```javascript
export default function(bot, client) {

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
