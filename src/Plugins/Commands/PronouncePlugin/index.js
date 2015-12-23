'use strict'

import Utils from '../../../Utils'

export default function(bot) {

  const setVoiceName = (user, voiceName) => {
    // set the new voice-pronounced name for the given user
    user.setVoiceName(voiceName)
    // saves the user
    bot.saveUser(user)
  }

  bot.createAdminCommand('pronounce', 'Sets a new pronunciation for a specified user.', (cmd, args) => {
    // retrieve the user
    const username = args.shift()
    const user = bot.createUser(username)
    // set a new voice name
    setVoiceName(user, args.join(' '))
  })

  bot.createCommand('callme', 'Sets a new pronunciation for yourself.', (cmd, args, stanza) => {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    const user = bot.createUser(username)
    // set a new voice name
    setVoiceName(user, args.join(' '))
  })

}
