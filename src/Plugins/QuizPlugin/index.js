'use strict'

import request from 'request'

export default function (bot) {

  const API_URL = 'http://trivia.propernerd.com/'
  const API_KEY = process.env.TRIVIA_KEY
  const API_SECRET = process.env.TRIVIA_SECRET

  /**
   * Makes a call to the trivia API
   */
  const _call = (endpoint, callback) => {
    return request(API_URL + endpoint, callback).auth(API_KEY, API_SECRET, false)
  }

  /**
   * Retrieves a random question from the API
   */
  const getRandomQuestion = () => {
    console.log('retrieving random question...')
    _call('/api/questions?limit=1&random=true', (error, response, body) => {
      if (error) {
        console.log(error)
      } else {
        bot.say(body.question)
      }
    })
  }

  bot.createAdminCommand('question', 'Asks a new question.', () => {
    getRandomQuestion()
  })

}
