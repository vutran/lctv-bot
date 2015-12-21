'use strict'

import Bot from './src/Bot'
import Client from './src/Client'
import Users from './src/Users'

// Load env. vars
require('dotenv').load()

// Create a new client
let client = new Client({
  username: process.env.LCTV_USERNAME,
  password: process.env.LCTV_PASSWORD
})

// Create a new users list
let users = new Users()

// Create a new Bot
let bot = new Bot({
  client,
  users,
  channel: process.env.LCTV_CHANNEL,
  mentions: process.env.LCTV_MENTIONS.split(','),
  admins: process.env.LCTV_ADMINS.split(','),
  followersUrl: process.env.LCTV_FOLLOWERS_URL
})

bot.start()
