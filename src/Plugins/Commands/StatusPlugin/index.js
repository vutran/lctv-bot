'use strict'

import Utils from '../../../Utils'

/**
 * Adds new command "!status <away|available>".
 *
 * !status <away|avaiable>
 * !away
 * !available
 *
 * Sets your status to "away" or "available".
 * If away, the bot will automatically reply when the user is mentioned.
 */
export default function(bot, client) {

  /**
   * Updates the given user's status
   *
   * @param User user
   * @param string newStatus
   */
  const updateStatus = (user, newStatus) => {
    const availableStatus = ['away', 'available']
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

  bot.createCommand('status', 'Sets your status to "away" or "available". If away, the bot will automatically reply when the user is mentioned.', (cmd, args, stanza) => {
    // retrieve the new status
    const newStatus = args[0]
    if (!newStatus ) {
      // no status is set, display the help
      bot.say('Please specify a status (Example: !status <away|available>).')
    } else {
      // retrieve the username
      const username = Utils.getUsername(stanza.getAttr('from'))
      const user = bot.createUser(username)
      updateStatus(user, newStatus)
    }
  })

  bot.createCommand('away', 'Sets your status as away.', (cmd, args, stanza) => {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    const user = bot.createUser(username)
    updateStatus(user, 'away')
  })

  bot.createCommand('available', 'Sets your status as available.', (cmd, args, stanza) => {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    const user = bot.createUser(username)
    updateStatus(user, 'available')
  })

  // When a user joins the channel, make them available by default
  client.on('lctv:channel:join', (user) => {
    // make user available
    user.setAvailable()
    // saves the user
    bot.saveUser(user)
  })

  // When a user is mentioned and is away, display a notification
  client.on('lctv:mentions:all', (username, stanza) => {
    // retrieve the mentioned users
    const mentioned = Utils.getMentions(stanza.getChildText('body'))
    if (mentioned.length) {
      mentioned.forEach((mentionedUsername) => {
        mentionedUsername = mentionedUsername.substr(1)
        // if mentioned username is in the users collection
        if (bot.users.exists(mentionedUsername)) {
          // create the mentioned user
          let mentionedUser = bot.createUser(mentionedUsername)
          if (mentionedUser.isAway()) {
            bot.say(mentionedUsername + ' is currently away.')
          }
        }
      })
    }
  })

}
