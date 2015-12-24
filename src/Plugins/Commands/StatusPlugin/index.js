'use strict'

/**
 * Adds new command "!status <away|available> <message>".
 *
 * !status <away|avaiable> <message>
 * !away <message>
 * !brb <message>
 * !available
 * !back
 *
 * Sets your status to "away" or "available".
 * If away, the bot will automatically reply when the user is mentioned.
 */
export default function(bot) {

  /**
   * Updates the given user's status
   *
   * @param User user
   * @param string newStatus
   * @param string message        If new status is away, set's the away message
   */
  const updateStatus = (user, newStatus, message = '') => {
    const availableStatus = ['away', 'available']
    // if a valid status
    if (availableStatus.indexOf(newStatus) > -1) {
      switch(newStatus) {
        case 'away':
          user.setAway(message)
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
    const newStatus = args.shift()
    if (!newStatus ) {
      // no status is set, display the help
      bot.say('Please specify a status (Example: !status <away|available> [<message>]).')
    } else {
      // create the User instance
      bot.retrieveUserFromStanza(stanza, (user) => {
        const message = args.join(' ')
        updateStatus(user, newStatus, message)
      })
    }
  })

  bot.createCommand(['away', 'brb'], 'Sets your status as away.', (cmd, args, stanza) => {
    // create the User instance
    bot.retrieveUserFromStanza(stanza, (user) => {
      const message = args.join(' ')
      updateStatus(user, 'away', message)
    })
  })

  bot.createCommand(['available', 'back'], 'Sets your status as available.', (cmd, args, stanza) => {
    // create the User instance
    bot.retrieveUserFromStanza(stanza, (user) => {
      updateStatus(user, 'available')
    })
  })

  // When a user joins the channel, make them available by default
  bot.on('lctv:channel:join', (user) => {
    // make user available
    user.setAvailable()
    // saves the user
    bot.saveUser(user)
  })

  // When a user is mentioned and is away, display a notification
  bot.on('lctv:mentions:all', (username, stanza) => {
    // retrieve the mentioned users
    const mentioned = bot.getMentionsFromValue(stanza.getChildText('body'))
    if (mentioned.length) {
      mentioned.forEach((mentionedUsername) => {
        mentionedUsername = mentionedUsername.substr(1)
        // if mentioned username is in the users collection
        if (bot.users.exists(mentionedUsername)) {
          // create the mentioned user
          bot.retrieveUser(mentionedUsername, {}, (mentionedUser) => {
            // if the user is away
            if (mentionedUser.isAway()) {
              let awayMessage = ''
              // if away message exists, set it
              if (mentionedUser.getAwayMessage().length) {
                awayMessage = ' (' + mentionedUser.getAwayMessage() + ')'
              }
              bot.say(mentionedUsername + ' is currently away.' + awayMessage)
            }
          })
        }
      })
    }
  })

}
