'use strict'

import Utils from '../../../Utils'

/**
 * Adds a new command "!views".
 *
 * Display the number of times you have visited the channel.
 */
export default function(bot, client) {

  bot.createCommand('views', 'Display the number of times you have visited the channel.', (cmd, args, stanza) => {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    const user = bot.createUser(username)
    bot.say(user.getMention() + ': You have ' + user.getViews() + ' views.')
  })

  // When a user joins the channel, increment the view count
  bot.on('lctv:channel:join', (user) => {
    // increment user view
    user.view()
    // saves the user
    bot.saveUser(user)
  })

}
