'use strict'

import Watcher from 'rss-watcher'

/**
 * Adds a notification when you have a new follower.
 */
export default function(bot, client) {

  // retrieve the followers URL
  const LCTV_FOLLOWERS_URL = process.env.LCTV_FOLLOWERS_URL
  const WATCH_INTERVAL = 5 // in seconds
  const NEW_FOLLOWER_MESSAGE = 'Thank you for following me, %user%.'

  // set the followers storage device
  const store = bot.createStore('followers')

  // retrieve users from store or create a new list of users
  const users = store.get('list') || []

  // create the watcher
  const watcher = new Watcher(LCTV_FOLLOWERS_URL)

  /**
   * Checks if the given username is already following
   *
   * @param string username
   * @return bool
   */
  const exists = (username) => {
    return users.indexOf(username) > -1 ? true : false
  }

  /**
   * Adds a username to the followers list
   *
   * @param string user
   */
  const add = (username) => {
    users.push(username)
  }

  /**
   * Saves the followers list to the store
   */
  const save = () => {
    store.set('list', users)
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  const getNewFollowerMessage = (user) => {
    let value = bot.getContent('newFollowerMessage') || NEW_FOLLOWER_MESSAGE
    return value.replace(/\%user\%/, user.getUsername())
  }

  // poll every 5 seconds...
  watcher.set({
    feed: LCTV_FOLLOWERS_URL,
    interval: WATCH_INTERVAL
  })

  // register events
  watcher.on('new article', (item) => {
    client.emit('lctv:follower:new', item)
  })

  watcher.on('error', (error) => {
    client.emit('lctv:follower:error', error)
    console.error(error)
  })

  watcher.run((error, articles) => {
    client.emit('lctv:follower:run', error, articles)
    if (error) {
      console.error(error)
    }
    if (articles && articles.length) {
      // set changed flag
      let changed = false
      // iterate through all
      articles.forEach((item) => {
        // if not yet in the list
        if (!exists(item.title)) {
          // add to users list
          add(item.title)
          changed = true
        }
      })
      if (changed) {
        // save to store
        save()
      }
    }
  })

  bot.on('lctv:follower:new', (item) => {
    const username = item.title
    // if not yet in users collection
    if (!exists(username)) {
      // create the user
      const user = bot.createUser(username)
      // add to followers user collection
      add(username)
      // save the followers
      save()
      // set the message
      const message = user.getUsername() + ' just followed you.'
      // show notifications
      bot.say(getNewFollowerMessage(user))
      bot.speak(getNewFollowerMessage(user))
      bot.notify(message)
    }
  })

}
