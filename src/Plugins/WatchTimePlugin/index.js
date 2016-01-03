'use strict'

import co from 'co'
import moment from 'moment'
import Users from '../../Users'

/**
 * Tracks the amount of time a user has spent watching the stream
 * with leaderboards.
 */
export default function(bot) {

  // amount of top watchers to display
  const TOP_COUNT = 10
  const WATCH_DELAY = 5
  const USERS = new Users()

  const checkTop = () => {
    const userStore = bot.getUserStore()
    co(function*() {
      console.log(' ----- CURRENT LEADERS -----')
      let db = yield userStore.connect()
      let collection = userStore.getCollection(db)
      // find top users (excludes the channel's owner and bot username)
      collection.find({
        "value.username": { $nin: [bot.getChannel(), bot.getClient().getUsername()] },
        "value.watchTime": { $exists: true }
      }).sort({"value.watchTime": -1}).limit(TOP_COUNT).toArray((err, docs) => {
        if (docs && docs.length) {
          docs.forEach((row) => {
            const duration = moment.duration(row.value.watchTime, 'seconds').humanize()
            console.log(`${row.key}: about ${duration}`)
          })
        }
        db.close()
      })
    })
  }

  // Create a new command "!watch-time""
  bot.createAdminCommand('watch-time', 'Displays how long you\'ve been watching the stream.', (cmd, args, stanza) => {
    bot.retrieveUserFromStanza(stanza, (user) => {
      const duration = moment.duration(user.watchTime, 'seconds').humanize()
      bot.say(`${user.getUsername()}: You've been watching for about ${duration}.`)
    })
  })

  // Create a new command "!top-watchers"
  bot.createAdminCommand('top-watchers', 'Displays the watch leaderboard', () => {
    checkTop()
  })

  bot.createAdminCommand('online', 'Displays the list of users online', () => {
    console.log(bot.getUsers())
  })

  // Append initial users to the list
  bot.on('lctv:channel:initial', (user) => {
    USERS.add(user)
  })

  // When a user part the channel, remove from the list
  bot.on('lctv:channel:part', (user) => {
    USERS.removeByUsername(user.getUsername())
  })

  // When a user joins the channel, add to the list
  bot.on('lctv:channel:join', (user) => {
    USERS.add(user)
  })

  // Increment every minute
  bot.on('lctv:timer:tick', (ticks) => {
    if (ticks % WATCH_DELAY === 0) {
      USERS.getAll().forEach((user) => {
        // sets the new watch time and save the user
        user.watchTime = (user.watchTime || 0) + WATCH_DELAY
        bot.saveUser(user)
      })
    }
  })

  // When the user is retrieved, set the watchTime data
  bot.on('lctv:user:retrieve', (user, data) => {
    user.watchTime = data.watchTime
  })

}
