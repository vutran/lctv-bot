'use strict'

/**
 * Adds a new admin-only command "!say <message>".
 *
 * Says whatever the message is to the room.
 */
export default function(bot) {

  bot.createAdminCommand('say', 'Says whatever the message is to the room.', (cmd, args) => {
    bot.speak(args.join(' '))
  })

}
