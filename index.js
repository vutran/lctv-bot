'use strict'

import Bot from './src/Bot'
import Client from './src/Client'
import Users from './src/Users'

// import admin-only plugins
import SettingsPlugin from './src/Plugins/Commands/SettingsPlugin'
import SayPlugin from './src/Plugins/Commands/SayPlugin'

// import public plugins
import EchoPlugin from './src/Plugins/Commands/EchoPlugin'
import GitHubPlugin from './src/Plugins/Commands/GitHubPlugin'
import HelpPlugin from './src/Plugins/Commands/HelpPlugin'
import ProjectPlugin from './src/Plugins/Commands/ProjectPlugin'
import StatusPlugin from './src/Plugins/Commands/StatusPlugin'
import ViewsPlugin from './src/Plugins/Commands/ViewsPlugin'
import WebsitePlugin from './src/Plugins/Commands/WebsitePlugin'

// import other plugins
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
  plugins: [
    // Admin plugins
    SettingsPlugin,
    SayPlugin,
    // Public plugins
    EchoPlugin,
    GitHubPlugin,
    HelpPlugin,
    ProjectPlugin,
    SayPlugin,
    StatusPlugin,
    ViewsPlugin,
    WebsitePlugin,
    // Other plugins
    FollowersPlugin
  ]
})
