'use strict'

export default function(bot) {

  bot.createCommand('streamingguide', 'Prints the link to the LiveCoding.tv streaming guide.', () => {
    bot.say('https://www.livecoding.tv/streamingguide/')
  })

  bot.createCommand('support', 'Prints the link to the LiveCoding.tv support web site.', () => {
    bot.say('http://support.livecoding.tv/hc/en-us/')
  })

}
