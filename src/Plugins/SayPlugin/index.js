'use strict'

/**
 * Says whatever the message is to the room.
 */
export default function(bot) {

  // Creates a new admin command "!say"
  bot.createAdminCommand('say', 'Says whatever the message is to the room.', (cmd, args) => {
    bot.speak(args.join(' '))
  })

}
