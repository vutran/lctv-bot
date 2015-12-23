'use strict'

import Notifications from '../../Notifications'
import Voice from '../../Voice'

/**
 * Adds a welcome message every time a user enters the chat room.
 * - Displays a desktop notification
 * - Speaks (text and voice) to room
 */
export default function(bot, client) {

  // set default values
  const WELCOME_MESSAGE = 'Welcome %user% to the stream.'
  const WELCOME_BACK_MESSAGE = 'Welcome back %user%.'

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  const getWelcomeMessage = (user) => {
    let value = bot.getContent('welcomeMessage') || WELCOME_MESSAGE
    return value.replace(/\%user\%/, user.getUsername())
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  const getWelcomeBackMessage = (user) => {
    let value = bot.getContent('welcomeBackMessage') || WELCOME_BACK_MESSAGE
    return value.replace(/\%user\%/, user.getUsername())
  }

  client.on('lctv:channel:join', (user) => {
    let message = getWelcomeMessage(user)
    if (user.getViews() > 0) {
      message = getWelcomeBackMessage(user)
    }
    // display in channel
    client.say(message)
    // say in channel
    Voice.say(message)
    // desktop notification
    let notifMessage = user.getUsername() + ' just joined the channel.'
    Notifications.show(bot.getName(), notifMessage)
  })

}
