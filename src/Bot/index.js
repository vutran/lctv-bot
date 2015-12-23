'use strict'

import util from 'util'
import Users from '../Users'
import User from '../User'
import Store from '../Store'
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
   * @param Client config.client          An instance of Client
   * @param string config.channel         The name of the channel to join
   * @param array config.mentions         A list of strings to watch for
   * @param array config.admins           A list of admins
   */
  constructor(config) {
    this.client = config.client
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
    this.content = this.store.get('content') || this.defaultContent

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
  }

  /**
   * Retrieves the bot name
   */
  getName() {
    return this.getContent('botName')
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
   * Creates a new storage device
   *
   * @param string name       A unique name of the storage device.
   */
  createStore(name) {
    return new Store({
      dir: name
    })
  }

  /**
   * Creates a User instance from the given username.
   * Loads stored data if found.
   *
   * @param string username
   * @param object options
   * @param string options.role         The role of the user
   * @return User
   */
  createUser(username, options = {}) {
    // retrieve stored user or create new one
    const defaultData = {
      username,
      voiceName: username,
      views: 0,
      status: 'available',
      awayMessage: ''
    }
    const data = Object.assign({}, defaultData, this.userStore.get(username))
    const user = new User(data.username, data.views, data.status)
    // set the user's voice-pronounced name
    user.setVoiceName(data.voiceName)
    // sets the away message
    user.setAwayMessage(data.awayMessage)
    // set the user's role
    user.setRole(data.role || options.role || 'participant')
    return user
  }

  /**
   * Creates a User instance from a stanza
   *
   * @param Stanza stanza
   * @return User
   */
  createUserFromStanza(stanza) {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    return this.createUser(username)
  }

  /**
   * Saves the User instance
   *
   * @param User user
   */
  saveUser(user) {
    // saves to store
    this.userStore.set(user.getUsername(), user)
    // updates collection
    this.users.replaceByUsername(user.getUsername(), user)
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
   * @param string cmd
   * @param string description
   * @param function handler
   */
  createAdminCommand(cmd, description, handler) {
    // create a new Command
    const command = new Command(cmd, description, handler)
    this.adminCommands.push(command)
    this.on('lctv:cmd:admin', command.exec.bind(command))
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
