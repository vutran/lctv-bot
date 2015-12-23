'use strict'

/**
 * Adds a new command "!project".
 *
 * Prints the project information.
 */
export default function(bot, client) {

  const PROJECT_INFO = bot.getContent('projectInfo') || 'Not yet available.'

  bot.createCommand('project', 'Prints the project information.', () => {
    client.say(PROJECT_INFO)
  })

}
