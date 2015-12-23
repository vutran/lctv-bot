'use strict'

export default function (bot) {

  const TICK_DELAY = 300
  let LAST_MESSAGE = -1
  const MESSAGES = [
    'Remember to follow me if you like my stream. :)',
    'TIP: Need help? Type !help for a list of commands.',
    'TIP: Help keep the stream pumping with music! Request a song now with !request <youtubeId>',
    'TIP: Want to look up some information about anything? Just type !lookup <query>'
  ]

  // Display the help message every 5 minutes
  bot.on('lctv:timer:tick', (ticks) => {
    if (ticks % TICK_DELAY === 0) {
      // increment to the next index
      LAST_MESSAGE++
      // if out of bounds, restart to first message
      if (LAST_MESSAGE > MESSAGES.length) {
        LAST_MESSAGE = 0
      }
      const message = MESSAGES[LAST_MESSAGE]
      bot.say(message)
    }
  })

}
