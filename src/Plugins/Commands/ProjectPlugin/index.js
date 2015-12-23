'use strict'

/**
 * Adds a new command "!project".
 *
 * Prints the project information.
 */
export default function(bot) {

  const PROJECT_INFO = bot.getContent('projectInfo') || 'Not yet available.'

  bot.createCommand('project', 'Prints the project information.', () => {
    bot.say(PROJECT_INFO)
  })

}
