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

  const AVAILABLE_STATUS = ['away', 'available']

  /**
   * Updates the given user's status
   *
   * @param User user
   * @param string newStatus
   * @param string message        If new status is away, set's the away message
   */
  const updateStatus = (user, newStatus, message = '') => {
    // if a valid status
    if (AVAILABLE_STATUS.indexOf(newStatus) > -1) {
      // sets the new status
      user.status = newStatus
      // sets the away message if necessary
      if (user.status === 'away') {
        user.awayMessage = message
      }
    }
    // save the user
    bot.saveUser(user)
  }

  // Creates a new command "!status"
  bot.createCommand('status', 'Sets your status to "away" or "available". If away, the bot will automatically reply when the user is mentioned.', (cmd, args, stanza) => {
    // retrieve the new status
    const newStatus = args.shift()
    if (!newStatus ) {
      // no status is set, display the help
      bot.say('Please specify a status (Example: !status <away|available> [<message>]).')
    } else {
      // retrieve the User instance from the store
      bot.retrieveUserFromStanza(stanza, (user) => {
        updateStatus(user, newStatus, args.join(' '))
      })
    }
  })

  // Creates new short commands "!away", and "!brb"
  bot.createCommand(['away', 'brb'], 'Sets your status as away.', (cmd, args, stanza) => {
    // retrieve the User instance from the store
    bot.retrieveUserFromStanza(stanza, (user) => {
      updateStatus(user, 'away', args.join(' '))
    })
  })

  // Creates new short commands "!avaiable", and "!back"
  bot.createCommand(['available', 'back'], 'Sets your status as available.', (cmd, args, stanza) => {
    // retrieve the User instance from the store
    bot.retrieveUserFromStanza(stanza, (user) => {
      updateStatus(user, 'available')
    })
  })

  // When a user joins the channel, make them available by default
  bot.on('lctv:channel:join', (user) => {
    updateStatus(user, 'available')
  })

  // When a user is mentioned and is away, display a notification in the channel
  bot.on('lctv:mentions:all', (username, stanza) => {
    // retrieve the mentioned users
    const mentioned = bot.getMentionsFromValue(stanza.getChildText('body'))
    // if any users are mentioned in the message string
    if (mentioned.length) {
      mentioned.forEach((mentionedUsername) => {
        // strip the prefix "@"
        mentionedUsername = mentionedUsername.substr(1)
        // if mentioned username is in the online users collection
        if (bot.getUsers().exists(mentionedUsername)) {
          // retrieve the mentioned user from the store
          bot.retrieveUser(mentionedUsername, {}, (mentionedUser) => {
            // if the user is away
            if (mentionedUser.status === 'away') {
              let awayMessage = ''
              // if away message exists, set it
              if (mentionedUser.awayMessage && mentionedUser.awayMessage.length) {
                awayMessage = ' (' + mentionedUser.awayMessage + ')'
              }
              bot.say(mentionedUsername + ' is currently away.' + awayMessage)
            }
          })
        }
      })
    }
  })

  // When the uesr is retrieved, set the user data
  bot.on('lctv:user:retrieve', (user, data) => {
    // sets the status
    user.status = data.status
    // sets the away message
    user.awayMessage = data.awayMessage
  })

}
