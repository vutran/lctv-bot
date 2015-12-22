'use strict'

/**
 * Adds a new admin-only command "!echo <message>".
 *
 * Prints the entered mesasge back to the room.
 */
export default function(bot, client) {

  bot.createCommand('echo', 'Prints the entered mesasge back to the room.', (cmd, args) => {
    client.say(args.join(' '))
  })

}
