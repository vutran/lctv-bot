'use strict'

import Bot from './src/Bot'
import Client from './src/Client'
import Users from './src/Users'

// import plugins
import FollowersPlugin from './src/Plugins/FollowersPlugin'

// Load env. vars
require('dotenv').load()

// Create a new client
const client = new Client({
  username: process.env.LCTV_USERNAME,
  password: process.env.LCTV_PASSWORD
})

// Create a new users list
const users = new Users()

// Create a new Bot
new Bot({
  client,
  users,
  channel: process.env.LCTV_CHANNEL,
  mentions: process.env.LCTV_MENTIONS.split(','),
  admins: process.env.LCTV_ADMINS.split(','),
  plugins: [ FollowersPlugin ]
})
