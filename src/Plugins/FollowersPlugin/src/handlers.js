'use strict'

import Notifications from '../../../Notifications'
import Voice from '../../../Voice'

export function handleError(error) {
  this.emit('lctv:follower:error', error)
  console.error(error)
}

export function handleNewArticle(item) {
  this.emit('lctv:follower:new', item)
}

export function handleRun(error, articles) {
  this.emit('lctv:follower:run', error, articles)
  if (error) {
    console.error(error)
  }
  if (articles && articles.length) {
    // set changed flag
    let changed = false
    // iterate through all
    articles.forEach((item) => {
      // if not yet in the list
      if (!this.exists(item.title)) {
        // add to users list
        this.add(item.title)
        changed = true
      }
    })
    if (changed) {
      // save to store
      this.save()
    }
  }
}

/**
 * Handles new follower events from rss-watcher
 *
 * TODO: decouple bot instance
 * @param object item
 */
export function handleNewFollower(item) {
  const username = item.title
  // if not yet in users collection
  if (!this.exists(username)) {
    let bot = this.config.bot
    // create the user
    const user = bot.createUser(username)
    // add to followers user collection
    this.add(username)
    // save the followers
    this.save()
    // set the message
    const message = user.getUsername() + ' just followed you.'
    // show notifications
    bot.client.say(this.getNewFollowerMessage(user))
    Notifications.show(bot.getContent('botName'), message)
    Voice.say(this.getNewFollowerMessage(user))
  }
}
