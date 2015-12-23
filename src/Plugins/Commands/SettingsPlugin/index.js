'use strict'

import Notifications from '../../../Notifications'

/**
 * Adds a new admin-only comment "!set <key> <value>"
 *
 * Sets a general setting value.
 */
export default function(bot) {

  bot.createAdminCommand('set', 'Sets a general setting value.', (cmd, args) => {
    // retrieve the key and remove the first value
    const key = args.shift()
    const value = args.join(' ')
    // sets the content
    bot.setContent(key, value)
    // displays the notification
    Notifications.show(bot.getName(), 'Updating content (' + key + ') to: ' + value)
  })

}
