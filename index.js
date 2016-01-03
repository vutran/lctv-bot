'use strict'

import Bot from './src/Bot'
import Client from './src/Client'

// import plugins
import SettingsPlugin from './src/Plugins/SettingsPlugin'
import SayPlugin from './src/Plugins/SayPlugin'
import EchoPlugin from './src/Plugins/EchoPlugin'
import GitHubPlugin from './src/Plugins/GitHubPlugin'
import HelpPlugin from './src/Plugins/HelpPlugin'
import ProjectPlugin from './src/Plugins/ProjectPlugin'
import StatusPlugin from './src/Plugins/StatusPlugin'
import ViewsPlugin from './src/Plugins/ViewsPlugin'
import WebsitePlugin from './src/Plugins/WebsitePlugin'
import PronouncePlugin from './src/Plugins/PronouncePlugin'
import GreetPlugin from './src/Plugins/GreetPlugin'
import FollowersPlugin from './src/Plugins/FollowersPlugin'
import MentionsPlugin from './src/Plugins/MentionsPlugin'
import LiveCodingPlugin from './src/Plugins/LiveCoding'
import JokesPlugin from './src/Plugins/JokesPlugin'
import WolframPlugin from './src/Plugins/WolframPlugin'
import AudioPlaylistPlugin from './src/Plugins/AudioPlaylistPlugin'
import TickerPlugin from './src/Plugins/TickerPlugin'
import WatchTimePlugin from './src/Plugins/WatchTimePlugin'

// Load env. vars
require('dotenv').load()

// Create a new client
const client = new Client({
  username: process.env.LCTV_USERNAME,
  password: process.env.LCTV_PASSWORD
})

// Create a new Bot
new Bot({
  dbHost: 'mongodb://dockerhost:27017',
  client,
  channel: process.env.LCTV_CHANNEL,
  mentions: process.env.LCTV_MENTIONS.split(','),
  admins: process.env.LCTV_ADMINS.split(','),
  plugins: [
    SettingsPlugin,
    SayPlugin,
    PronouncePlugin,
    EchoPlugin,
    GitHubPlugin,
    HelpPlugin,
    ProjectPlugin,
    SayPlugin,
    StatusPlugin,
    ViewsPlugin,
    WebsitePlugin,
    FollowersPlugin,
    GreetPlugin,
    MentionsPlugin,
    LiveCodingPlugin,
    JokesPlugin,
    WolframPlugin,
    AudioPlaylistPlugin,
    TickerPlugin,
    WatchTimePlugin
  ]
})
