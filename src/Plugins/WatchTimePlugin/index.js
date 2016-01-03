'use strict'

import co from 'co'
import Users from '../../Users'

/**
 * Tracks the amount of time a user has spent watching the stream
 * with leaderboards.
 */
export default function(bot) {

  // create a new store to track top watchers
  const store = bot.createStore('watch-time')
  // create a collection of top watchers
  const topWatchers = new Users()
  // amount of top watchers to display
  const TOP_COUNT = 10

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
            console.log(`${row.key}: ${row.value.watchTime}`)
          })
        }
        db.close()
      })
    })
  }

  bot.createCommand('watch-time', 'Displays how long you\'ve been watching the stream.', (cmd, args, stanza) => {
    bot.retrieveUserFromStanza(stanza, (user) => {
      bot.say(`${user.getUsername()}: You've been watching for ${user.getWatchTime()/60} minutes`)
    })
  })

  // Create a leaderboard command
  // bot.createCommand('top-watchers', 'Displays the watch leaderboard', () => {
  //   checkTop()
  // })

  // test: checks who is online
  // bot.createAdminCommand('online', 'Check who is online', () => {
  //   console.log(bot.getUsers().getAll())
  // })

  // Increment every minute
  bot.on('lctv:timer:tick', (ticks) => {
    if (ticks % 60 === 0) {
      const users = bot.getUsers()
      console.log(`------ ONLINE USERS: ${users.count()}------`)
      users.getAll().forEach((user) => {
        const watchTime = user.getWatchTime() || 0
        // inc by 60 seconds
        const newWatchTime = watchTime + 60
        // sets the new watch time and save the user
        user.setWatchTime(newWatchTime)
        bot.saveUser(user)
        console.log(`${user.getUsername()} watch time incremented by 60 seconds. (Total: ${user.getWatchTime()}s)`)
      })
    }
  })

}
