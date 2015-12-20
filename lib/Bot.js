import moment from 'moment'
import Client from './Client'
import Users from './Users'
import User from './User'
import Store from './Store'
import Notifications from './Notifications'

// import commands
import { githubLink, help, project, views } from './commands'
import { echo, setContent, start } from './commands/admin'

export default class Bot {

  /**
   * @param object config
   * @param Client config.client     An instance of Client
   * @param Users config.users       An instance of Users
   * @param string config.channel    The name of the channel to join
   * @param array config.mentions    A list of strings to watch for
   */
  constructor(config) {
    this.client = config.client
    this.users = config.users || new Users()
    this.setChannel(config.channel)

    // set mentions
    this.setMentions(config.mentions)
    this.client.setMentions(config.mentions)

    // create new storage device
    this.store = new Store({
      dir: 'general'
    })
    this.userStore = new Store({
      dir: 'user'
    })

    // set default values
    this.started = false
    this.botName = 'LCTV Bot'
    this.defaultContent = {
      githubLink: 'https://github.com/vutran/lctv-bot',
      projectInfo: 'Not yet available.',
      welcomeBackMessage: 'Welcome back %user.',
      welcomeMessage: 'Welcome %user% to the stream.'
    }
    this.content = this.store.get('content') || this.defaultContent

    // register custom events
    this.client.on('online', this.handleOnline.bind(this))
    this.client.on('lctv:cmd', this.handleCommands.bind(this))
    this.client.on('lctv:cmd:admin', this.handleAdminCommands.bind(this))
    this.client.on('lctv:presence', this.handleInitialPresence.bind(this))
    this.client.on('lctv:presence', this.handleUnavailablePresence.bind(this))
    this.client.on('lctv:mentions', this.handleMentions.bind(this))

    // connect the Client
    this.client.connect()
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
   * Starts the bot.
   * Begins listening for new presences.
   */
  start() {
    if (!this.isStarted()) {
      this.started = true
      this.client.on('lctv:presence', this.handleNewPresence.bind(this))
      Notifications.show(this.botName, 'Bot is now started!')
    }
  }

  /**
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
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  getWelcomeMessage(user) {
    let value = this.getContent('welcomeMessage')
    return value.replace(/\%user\%/, user.getUsername())
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  getWelcomeBackMessage(user) {
    let value = this.getContent('welcomeBackMessage')
    return value.replace(/\%user\%/, user.getUsername())
  }

  /**
   * Creates a User instance from the given username.
   * Loads stored data if found.
   *
   * @param string username
   * @return User
   */
  createUser(username) {
    // retrieve stored view or create new one
    let data = this.userStore.get(username) || { username, views: 0 }
    return new User(data.username, data.views)
  }

  /**
   * Saves the User instance
   *
   * @param User user
   */
  saveUser(user) {
    this.userStore.set(user.getUsername(), user)
  }

  handleOnline(data) {
    // Joins the given channel
    this.join(this.getChannel())
  }

  /**
   * Handles the public commands.
   *
   * @param string cmd
   * @param array args
   * @param Stanza stanza
   */
  handleCommands(cmd, args, stanza) {
    switch(cmd) {
      case 'help':
        help.bind(this, cmd, args, stanza)()
        break;
      case 'githubLink':
        githubLink.bind(this, cmd, args, stanza)()
        break;
      case 'project':
        project.bind(this, cmd, args, stanza)()
        break;
      case 'views':
        views.bind(this, cmd, args, stanza)()
        break;
    }
  }

  /**
   * Handles the admin commands.
   *
   * @param string cmd
   * @param array args
   * @param Stanza stanza
   */
  handleAdminCommands(cmd, args, stanza) {
    switch(cmd) {
      case 'start':
        start.bind(this, cmd, args, stanza)()
        break;
      case 'echo':
        echo.bind(this, cmd, args, stanza)()
        break;
      case 'setContent':
        setContent.bind(this, cmd, args, stanza)()
        break;
    }
  }

  /**
   * Handles the initial presence.
   * Adds the initial users to the users list.
   *
   * @param Stanza stanza
   */
  handleInitialPresence(stanza) {
    // retrieve the user and strip the room
    let username = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
    let user = this.createUser(username)
    // if not yet in the users list
    if (!this.users.exists(user)) {
      // add user to the users list
      this.users.add(user)
    }
  }

  /**
   * Handles the unavailable presense (when a user leaves).
   * Removes the user from the users list
   *
   * @param Stanza stanza
   */
  handleUnavailablePresence(stanza) {
    // retrieve the user and strip the room
    let username = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
    let user = this.createUser(username)
    if (stanza.getAttr('type') === "unavailable") {
      // if in the users list
      if (this.users.exists(user)) {
        // remove user from the users list
        this.users.remove(user)
      }
    }
  }

  /**
   * Handles the new presence.
   * Displays the welcome messages to new users.
   * Adds the user to the users list.
   *
   * @param Stanza stanza
   */
  handleNewPresence(stanza) {
    if (stanza.getAttr('type') !== "unavailable") {
      // retrieve the username and strip the room
      let username = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
      let user = this.createUser(username)
      // if not own user
      if (user.getUsername() !== this.client.getUsername()) {
        if (user.getViews() > 0) {
          // display in channel
          this.client.say(this.getWelcomeBackMessage(user))
        } else {
          // display in channel
          this.client.say(this.getWelcomeMessage(user))
        }
        // desktop notification
        let message = user.getUsername() + ' just joined the channel.'
        Notifications.show(this.botName, message)
        // if not yet in the users list
        if (!this.users.exists(user)) {
          // add user to the users list
          this.users.add(user)
        }
        // increment user view
        user.view()
        // save user data
        this.saveUser(user)
      }
    }
  }

  /**
   * Handles mentions.
   * Display notifications.
   *
   * @param string username
   * @param Stanza stanza
   */
  handleMentions(username, stanza) {
    let body = stanza.getChildText('body')
    let message = username + ' mentioned you: ' + body
    Notifications.show(this.botName, message)
  }

}
