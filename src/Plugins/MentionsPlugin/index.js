'use strict'

/**
 * Display a desktop notification when someone mentions your username.
 */
export default function(bot) {

  bot.on('lctv:mentions:self', (username, stanza) => {
    const body = stanza.getChildText('body')
    const message = username + ' mentioned you: ' + body
    bot.notify(message)
  })

}
