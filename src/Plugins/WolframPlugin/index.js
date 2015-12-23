'use strict'

import wolfram from 'wolfram'

/**
 * Seek an answer? Look it up.
 */
export default function(bot) {

  const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID
  const LOOKUP_DELAY = 30
  let CAN_LOOKUP = true

  // create a store
  const store = bot.createStore('wolfram')

  const buildMessage = (results) => {
    let message = ''
    let firstInterpretation = ''
    results.forEach((item, key) => {
      if (key === 0) {
        item.subpods.forEach((subpod) => {
          if (subpod.value.length) {
            if (firstInterpretation.length > 0) {
              firstInterpretation += ' '
            }
            firstInterpretation += subpod.value
          }
        })
      }
      if (item.primary) {
        item.subpods.forEach((subpod) => {
          if (subpod.value.length) {
            if (message.length > 0) {
              message += ' '
            }
            message += subpod.value
          }
        })
      }
    })
    // if message is empty, set it as the first interpretation
    if (!message.length) {
      message = firstInterpretation
    }
    return message
  }

  const query = (q, callback) => {
    // lowercase
    q = q.toLowerCase()
    // retrieve from store
    let message = store.get(q)
    if (message) {
      callback.call(this, null, message)
    } else {
      // if the user is allowed to lookup
      if (CAN_LOOKUP && WOLFRAM_APP_ID.length) {
        const client = wolfram.createClient(WOLFRAM_APP_ID)
        client.query(q, (err, results) => {
          if (!err) {
            let message = buildMessage(results)
            if (message.length) {
              // disable lookup until next time
              CAN_LOOKUP = false
              // save into store
              store.set(q, message)
              callback.call(this, null, message)
            } else {
              callback.call(this, true)
            }
          }
        })
      } else {
        callback.call(this, true)
      }
    }
  }

  bot.createCommand('lookup', 'Seek an answer? Look it up.', (cmd, args) => {
    const q = args.join(' ')
    query(q, (error, message) => {
      if (!error) {
        bot.say(message)
      } else {
        bot.say('Not available at the moment. Please try again at a later time.')
      }
    })
  })

  // reset the lookup flag every 30 seconds
  bot.on('lctv:timer:tick', (ticks) => {
    if (ticks % LOOKUP_DELAY === 0) {
      CAN_LOOKUP = true
    }
  })

}
