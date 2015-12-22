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
    client.say(user.getMention() + ': You have ' + user.getViews() + ' views.')
  })

}
