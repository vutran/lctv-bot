'use strict'

/**
 * Adds a new command "!github".
 *
 * Prints the link to the GitHub repository of the project.
 */
export default function(bot, client) {

  const GITHUB_LINK = bot.getContent('githubLink') || 'https://github.com/vutran/lctv-bot'

  bot.createCommand('github', 'Prints the link to the GitHub repository of the project.', () => {
    client.say(GITHUB_LINK)
  })

}
