'use strict'

/**
 * Adds a new command "!website".
 *
 * Prints the link to the project web site.
 */
export default function(bot, client) {

  bot.createCommand('website', 'Prints the link to the project web site.', () => {
    const website = bot.getContent('website') || 'http://vu-tran.com'
    client.say(website)
  })

}
