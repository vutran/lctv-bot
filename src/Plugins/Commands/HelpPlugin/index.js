'use strict'

/**
 * Adds a new command "!help".
 *
 * Displays a list of available commands. For more information regarding a specific command, type "!help <command>"
 */
export default function(bot, client) {

  bot.createCommand('help', 'Displays a list of available commands. For more information regarding a specific command, type "!help <command>"', (cmd, args) => {
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
          client.say(command.getDescription())
        }
      })
    } else {
      const commandsArr = availableCommands.map((command) => {
        return '!' + command.getName()
      })
      client.say('Commands available: ' + commandsArr.join(', '))
    }
  })

}
