'use strict'

/**
 * Tracks the time each user has visited the channel.
 */
export default function(bot) {

  // Creates a new command "!views"
  bot.createCommand('views', 'Display the number of times you have visited the channel.', (cmd, args, stanza) => {
    // create the User instance
    bot.retrieveUserFromStanza(stanza, (user) => {
      bot.say(user.getMention() + ': You have joined this channel ' + user.view + ' times.')
    })
  })

  // When a user joins the channel, increment the view count
  bot.on('lctv:channel:join', (user) => {
    // increment user view
    user.view++
    // saves the user
    bot.saveUser(user)
  })

  // When the user is retrieved, set it's view property
  bot.on('lctv:user:retrieve', (user, data) => {
    user.view = data.view || 1
  })

}
