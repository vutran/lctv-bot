'use strict'

/**
 * Adds a new command "!github".
 *
 * Prints the link to the GitHub repository of the project.
 */
export default function(bot, client) {

  bot.createCommand('github', 'Prints the link to the GitHub repository of the project.', () => {
    client.say(bot.getContent('githubLink'))
  })

}
