'use strict'

export default function(bot) {

  const setVoiceName = (user, voiceName) => {
    // set the new voice-pronounced name for the given user
    user.setVoiceName(voiceName)
    // saves the user
    bot.saveUser(user)
  }

  bot.createAdminCommand('pronounce', 'Sets a new pronunciation for a specified user.', (cmd, args) => {
    // create the User instance
    const user = args.shift()
    // set a new voice name
    setVoiceName(user, args.join(' '))
  })

  bot.createCommand('callme', 'Sets a new pronunciation for yourself.', (cmd, args, stanza) => {
    // set a new voice name
    const voiceName = args.join(' ')
    if (!voiceName.length) {
      bot.say('Missing pronunciation. Usage: !callme <your new name>')
    } else {
      // create the User instance
      bot.retrieveUserFromStanza(stanza, (user) => {
        setVoiceName(user, voiceName)
        bot.speak('I will now call you ' + voiceName)
      })
    }
  })

}
