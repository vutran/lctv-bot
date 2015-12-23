'use strict'

/**
 * Adds a new command "!help" or "!commands".
 *
 * Displays a list of available commands. For more information regarding a specific command, type "!help <command>"
 */
export default function(bot) {

  const NEED_HELP = 'Need help? Type !help for a list of commands.'

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
    // every 5 minutes
    if (ticks % 300 === 0) {
      bot.say(NEED_HELP)
    }
  })

}
