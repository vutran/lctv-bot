'use strict'

/**
 * Adds a new command "!help" or "!commands".
 *
 * Displays a list of available commands. For more information regarding a specific command, type "!help <command>"
 */
export default function(bot) {

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

}
