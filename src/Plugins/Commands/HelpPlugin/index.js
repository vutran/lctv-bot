'use strict'

/**
 * Adds a new command "!help" or "!commands".
 *
 * Displays a list of available commands. For more information regarding a specific command, type "!help <command>"
 */
export default function(bot) {

  const NEED_HELP = 'Need help? Type !help for a list of commands.'
  let MESSAGE_COUNTER = 0

  bot.createCommand(['help', 'commands'], 'Displays a list of available commands. For more information regarding a specific command, type "!help <command>"', (cmd, args) => {
    // retrieve the list of commands
    const commands = bot.getCommands()
    // filter for available commands
    const availableCommands = commands.filter((command) => {
      if (command.getName() !== 'help') {
        return true
      }
      return false
    })
    // if an argument is passed (!help <command>)
    if (args[0].length) {
      availableCommands.forEach((command) => {
        if (command.getName() === args[0]) {
          bot.say(command.getDescription())
        }
      })
    } else {
      const commandsArr = availableCommands.map((command) => {
        return '!' + command.getName()
      })
      bot.say('Commands available: ' + commandsArr.join(', '))
      bot.say('For more information regarding a specific command, type "!help <command>"')
    }
  })

  // Display the help message every 5 minutes
  bot.on('lctv:timer:tick', (ticks) => {
    // every 10 minutes
    if (ticks % 600 === 0) {
      // if not displayed within the last 10 messages
      if (MESSAGE_COUNTER >= 10) {
        bot.say(NEED_HELP)
      }
    }
  })

  // increment the message counter when a new message is received
  bot.on('lctv:message', (stanza) => {
    const message = stanza.getChildText('body')
    if (message !== NEED_HELP) {
      MESSAGE_COUNTER++
    }
  })

}
