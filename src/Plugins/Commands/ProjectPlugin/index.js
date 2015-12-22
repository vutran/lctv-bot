'use strict'

/**
 * Adds a new command "!project".
 *
 * Prints the project information
 */
export default function(bot, client) {

  bot.createCommand('project', 'Prints the project information.', () => {
    client.say(bot.getContent('projectInfo'))
  })

}
