'use strict'

import MongoStore from './src/Store/MongoStore'
import User from './src/User'

const store = new MongoStore({
  name: 'users',
  host: 'mongodb://dockerhost:27017'
})

// create a new user
let user = new User({
  username: 'vutran'
})

// retrieve from store
store.get(user.getUsername(), (err, results) => {
  user = new User(results)
  // increment the view
  user.view()
  // save the user by it's username
  store.set(user.getUsername(), user, () => {
    store.get('vutran', (err, results) => {
      // create new user from results
      user = new User(results)
    })
  })
})
