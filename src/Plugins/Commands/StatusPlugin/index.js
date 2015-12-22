'use strict'

import Utils from '../../../Utils'

/**
 * Adds a new command "!status <away|available>".
 *
 * Sets your status to "away" or "available". If away, the bot will automatically reply when the user is mentioned.
 */
export default function(bot, client) {

  bot.createCommand('status', 'Sets your status to "away" or "available". If away, the bot will automatically reply when the user is mentioned.', (cmd, args, stanza) => {
    // retrieve the new status
    const newStatus = args[0]

    if (!newStatus ) {
      // no status is set, display the help
      client.say('Please specify a status (Example: !status <away|available>).')
    } else {
      const availableStatus = ['away', 'available']
      // retrieve the username
      const username = Utils.getUsername(stanza.getAttr('from'))
      const user = bot.createUser(username)
      // if a valid status
      if (availableStatus.indexOf(newStatus) > -1) {
        switch(newStatus) {
          case 'away':
            user.setAway()
            break
          case 'available':
            user.setAvailable()
            break
        }
      }
      // save the user
      bot.saveUser(user)
    }
  })

}
