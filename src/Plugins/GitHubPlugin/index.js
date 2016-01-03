'use strict'

/**
 * Adds a new command "!github".
 *
 * Prints the link to the GitHub repository of the project.
 */
export default function(bot) {

  const GITHUB_LINK = bot.getContent('githubLink') || 'https://github.com/vutran/'

  bot.createCommand('github', 'Prints the link to the developer\'s GitHub page.', () => {
    bot.say(GITHUB_LINK)
  })

}
