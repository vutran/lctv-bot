'use strict'

import request from 'request'

/**
 * Print a random Chuck Norris joke
 */
export default function(bot) {

  const API_URL = 'http://api.icndb.com/jokes/random'

  bot.createCommand('joke', 'Print a random Chuck Norris joke', () => {
    request(API_URL, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        bot.say(JSON.parse(body).value.joke)
      }
    })
  })

}
