'use strict'

/**
 * Adds a new command "!views".
 *
 * Display the number of times you have visited the channel.
 */
export default function(bot) {

  bot.createCommand('views', 'Display the number of times you have visited the channel.', (cmd, args, stanza) => {
    // create the User instance
    bot.retrieveUserFromStanza(stanza, (user) => {
      bot.say(user.getMention() + ': You have ' + user.getViews() + ' views.')
    })
  })

  // When a user joins the channel, increment the view count
  bot.on('lctv:channel:join', (user) => {
    // increment user view
    user.view()
    // saves the user
    bot.saveUser(user)
  })

}
