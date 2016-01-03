'use strict'

/**
 * Adds a greeting message every time a user enters the chat room.
 * - Displays a desktop notification
 * - Speaks (text and voice) to room
 * - Requires the ViewsPlugin for new/returning messages
 * - Requires the PronouncePlugin for custom voice-pronounced names
 */
export default function(bot) {

  // set default values
  const WELCOME_MESSAGE = 'Welcome %user% to the stream.'
  const WELCOME_BACK_MESSAGE = 'Welcome back %user%.'
  const GREET_MESSAGE = 'Hi %user%!. How\'s it going?'

  /**
   * Retrieve the welcome message.
   *
   * Variables:
   * - %user%
   *
   * @param User user
   * @param voiceName bool        Set to true to use the custom voice-pronounced name
   * @return string
   */
  const getWelcomeMessage = (user, voiceName = false) => {
    let value = bot.getContent('welcomeMessage') || WELCOME_MESSAGE
    const name = voiceName ? (user.voiceName || user.getUsername()) : user.getUsername()
    return value.replace(/\%user\%/, name)
  }

  /**
   * Retrieves the welcome back message
   *
   * Variables:
   * - %user%
   *
   * @param User user
   * @param voiceName bool        Set to true to use the custom voice-pronounced name
   * @return string
   */
  const getWelcomeBackMessage = (user, voiceName = false) => {
    let value = bot.getContent('welcomeBackMessage') || WELCOME_BACK_MESSAGE
    const name = voiceName ? (user.voiceName || user.getUsername()) : `@${user.getUsername()}`
    return value.replace(/\%user\%/, name)
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @param voiceName bool
   * @return string
   */
  const getGreetMessage = (user, voiceName = false) => {
    let value = bot.getContent('greetMessage') || GREET_MESSAGE
    const name = voiceName ? (user.voiceName || user.getUsername()) : `@${user.getUsername()}`
    return value.replace(/\%user\%/, name)
  }

  // When a new user joins the channel, greet them
  bot.on('lctv:channel:join', (user) => {
    // if not own user
    if (user.getUsername() !== bot.client.getUsername()) {
      let message = getWelcomeMessage(user)
      let voiceMessage = getWelcomeMessage(user, true)
      if (user.views > 0) {
        message = getWelcomeBackMessage(user)
        voiceMessage = getWelcomeBackMessage(user, true)
      }
      // say in channel
      bot.say(message)
      // speak in channel
      bot.speak(voiceMessage)
      // desktop notification
      bot.notify(user.getUsername() + ' just joined the channel.')
    }
  })

  bot.createAdminCommand('greet', 'Greets a specified user.', (cmd, args) => {
    // retrieve the user
    const username = args.shift()
    if (!username.length) {
      bot.say('Missing <username>.')
    } else {
      bot.retrieveUser(username, {}, (user) => {
        // retrieve the messages
        const message = getGreetMessage(user)
        const voiceMessage = getGreetMessage(user, true)
        bot.say(message)
        bot.speak(voiceMessage)
      })
    }
  })

}
