'use strict'

import util from 'util'
import Users from '../Users'
import User from '../User'
// import FileStore from '../Store/FileStore'
import MongoStore from '../Store/MongoStore'
import Notifications from '../Notifications'
import Voice from '../Voice'
import Timer from '../Timer'
import Command from '../Command'
import Utils from '../Utils'

// import handlers
import {
  handleTimerTick,
  handleOnline,
  handleAdminCommands,
  handleInitialPresence,
  handleUnavailablePresence,
  handleNewPresence
} from './handlers'

export default class Bot {

  /**
   * @param object config
   * @param string config.dbHost          The database host
   * @param Client config.client          An instance of Client
   * @param string config.channel         The name of the channel to join
   * @param array config.mentions         A list of strings to watch for
   * @param array config.admins           A list of admins
   */
  constructor(config) {
    this.setDatabaseHost(config.dbHost)
    this.setClient(config.client)
    this.setChannel(config.channel)
    this.setMentions(config.mentions)
    this.setAdmins(config.admins)

    // collection of users online
    this.users = new Users()

    // list of plugins
    this.plugins = (config.plugins && config.plugins.length) ? config.plugins : []

    // list of stored commands
    this.commands = []
    this.adminCommands = []

    // create a timer
    this.timer = new Timer()
    this.timer.on('lctv:timer:tick', handleTimerTick.bind(this))

    // create new storage device
    this.store = this.createStore('general')
    this.userStore = this.createStore('user')

    // set default values
    this.started = false
    this.defaultContent = {
      botName: 'LCTV Bot'
    }

    // Set the default general settings
    this.content = this.defaultContent

    // Load general settings
    this.store.get('content', (err, results) => {
      // set the general settings with the saved data
      if (results) {
        this.content = results
      }
      // register custom events
      this.on('online', handleOnline.bind(this))
      this.on('lctv:cmd:admin', handleAdminCommands.bind(this))
      this.on('lctv:presence', handleInitialPresence.bind(this))
      this.on('lctv:presence', handleUnavailablePresence.bind(this))
      // load plugins
      this.loadPlugins()
      // starts the timer
      this.timer.start()
      // connect the Client
      this.client.connect()
    })
  }

  setClient(client) {
    this.client = client
  }

  getClient() {
    return this.client
  }

  /**
   * Retrieves the bot name
   */
  getName() {
    return this.getContent('botName')
  }

  setDatabaseHost(databaseHost) {
    this.databaseHost = databaseHost
  }

  getDatabaseHost() {
    return this.databaseHost
  }

  /**
   * Sets the channel to join
   *
   * @param string channel
   */
  setChannel(channel) {
    this.channel = channel
  }

  /**
   * Retrieve the channel to join
   *
   * @return string
   */
  getChannel() {
    return this.channel
  }

  /**
   * Sets the mentions to watch
   *
   * @param array mentions
   */
  setMentions(mentions) {
    this.mentions = mentions
    this.client.setMentions(mentions)
  }

  /**
   * Retrieve the list of mentions
   *
   * @return array
   */
  getMentions() {
    return this.mentions
  }

  /**
   * Sets the list of admins
   *
   * @param array admins
   */
  setAdmins(admins) {
    this.admins = admins
    this.client.setAdmins(admins)
  }

  /**
   * Retrieve the list of admins
   *
   * @return array
   */
  getAdmins() {
    return this.admins
  }

  /**
   * Sets the content value
   *
   * @param string key
   * @param mixed value
   */
  setContent(key, value) {
    this.content[key] = value
    // save to store
    this.store.set('content', this.content)
  }

  /**
   * Retrieves the content value
   *
   * @param string key
   * @return mixed
   */
  getContent(key) {
    return this.content[key]
  }

  /**
   * Loads the specified plugin module
   *
   * @param function module
   */
  addPlugin(module) {
    this.plugins.push(module)
  }

  /**
   * Loads all given plugins
   */
  loadPlugins() {
    this.plugins.map((module) => {
      if (typeof module === 'function') {
        module.call(this, this)
      }
    })
  }

  /**
   * Starts the bot.
   * Begins listening for new presences.
   */
  start() {
    if (!this.isStarted()) {
      this.started = true
      this.on('lctv:presence', handleNewPresence.bind(this))
      Notifications.show(this.getName(), 'Bot is now started!')
    }
  }

  /**
   * Checks if the bot has been started
   *
   * @return bool
   */
  isStarted() {
    return this.started
  }

  /**
   * Joins the channel specified by a channel name
   *
   * @param string channel
   */
  join(channel) {
    this.client.join(channel)
  }

  /**
   * Leaves the channel specified by a channel name
   *
   * @param string channel
   */
  leave(channel) {
    this.client.leave(channel)
  }

  /**
   * Creates a new storage device
   *
   * @param string name       A unique name of the storage device.
   */
  createStore(name) {
    return new MongoStore({
      name,
      host: this.getDatabaseHost()
    })
  }

  /**
   * Retrieve a User instance from the given username.
   * Loads stored data if found, otherwise return a new instance.
   *
   * @param string username
   * @param object options
   * @param string options.role         The role of the user
   * @param function callback
   */
  retrieveUser(username, options, callback) {
    // retrieve stored user or create new one
    const defaultData = { username }
    let data = Object.assign({}, defaultData)
    // create a new user
    const user = new User(data)
    // retrieve user from store
    this.userStore.get(user.getUsername(), (err, results) => {
      if (util.isObject(results) || util.isArray(results)) {
        data = results
        // set the user's voice-pronounced name
        user.setVoiceName(data.voiceName)
        // sets the away message
        user.setAwayMessage(data.awayMessage)
        // set the user's role
        user.setRole(data.role || options.role || 'participant')
      }
      if (typeof callback === 'function') {
        callback.call(null, user)
      }
    })
  }

  /**
   * Creates a User instance from a stanza
   *
   * @param Stanza stanza
   * @param function callback
   */
  retrieveUserFromStanza(stanza, callback) {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    this.retrieveUser(username, {}, callback)
  }

  /**
   * Saves the User instance
   *
   * @param User user
   */
  saveUser(user) {
    // saves to store
    this.userStore.set(user.getUsername(), user, () => {
      // updates collection
      this.users.replaceByUsername(user.getUsername(), user)
    })
  }

  /**
   * Creates a new command and binds the command to the event
   *
   * @param array|string cmd        An array of strings or a string of command(s)
   * @param string description
   * @param function handler
   */
  createCommand(cmd, description, handler) {
    if (util.isArray(cmd)) {
      cmd.forEach((c) => {
        this.createCommand(c, description, handler)
      })
    } else {
      // create a new Command
      const command = new Command(cmd, description, handler)
      this.commands.push(command)
      this.on('lctv:cmd', command.exec.bind(command))
    }
  }

  /**
   * Creates a new admin-only command and binds the command to the event
   *
   * @param array|string cmd        An array of strings or a string of command(s)
   * @param string description
   * @param function handler
   */
  createAdminCommand(cmd, description, handler) {
    if (util.isArray(cmd)) {
      cmd.forEach((c) => {
        this.createAdminCommand(c, description, handler)
      })
    } else {    // create a new Command
      const command = new Command(cmd, description, handler)
      this.adminCommands.push(command)
      this.on('lctv:cmd:admin', command.exec.bind(command))
    }
  }

  /**
   * Retrieves a list of commands available
   *
   * @return array
   */
  getCommands() {
    return this.commands
  }

  /**
   * Retrieves a list of admin commands available
   *
   * @return array
   */
  getAdminCommands() {
    return this.adminCommands
  }

  /**
   * Retrieves a list of mentions
   */
  getMentionsFromValue(value) {
    return Utils.getMentions(value)
  }

  /**
   * Speaks the message to the room (voice)
   *
   * @param string message
   */
  speak(message) {
    Voice.say(message)
  }

  /**
   * Prints the message to the room (text)
   *
   * @param string message
   */
  say(message) {
    this.client.say(message)
  }

  /**
   * Displays a desktop notification
   *
   * @param string message
   */
  notify(message) {
    Notifications.show(this.getName(), message)
  }

  /**
   * Pass events down to the client
   */
  on(event, ...args) {
    this.client.on(event, ...args)
  }

  /**
   * Emit down to the client
   */
  emit(event, ...args) {
    this.client.emit(event, ...args)
  }

}
