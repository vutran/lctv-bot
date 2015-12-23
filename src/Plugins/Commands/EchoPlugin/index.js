'use strict'

/**
 * Adds a new admin-only command "!echo <message>".
 *
 * Prints the entered message back to the room.
 */
export default function(bot, client) {

  bot.createCommand('echo', 'Prints the entered message back to the room.', (cmd, args) => {
    bot.say(args.join(' '))
  })

}
