'use strict'

/**
 * Set and get a general settings value
 */
export default function(bot) {

  // Create a new admin command "!set"
  bot.createAdminCommand('set', 'Sets a general setting value.', (cmd, args) => {
    // retrieve the key and remove the first value
    const key = args.shift()
    const value = args.join(' ')
    // sets the content
    bot.setContent(key, value)
    // displays the notification
    bot.notify('Updating content (' + key + ') to: ' + value)
  })

}
