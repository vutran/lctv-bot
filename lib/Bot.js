import moment from 'moment'
import Client from './Client'
import Users from './Users'
import User from './User'
import Store from './Store'
import Notifications from './Notifications'

export default class Bot {

  /**
   * @param Client client     An instance of Client
   * @param Users users       An instance of Users
   */
  constructor(client, users) {
    this.client = client
    this.users = users || new Users()

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

    // connect the Client
    this.client.connect()

    // register custom events
    this.client.on('lctv:cmd', this.handleCommands.bind(this))
    this.client.on('lctv:cmd:admin', this.handleAdminCommands.bind(this))
    this.client.on('lctv:presence', this.handleInitialPresence.bind(this))
    this.client.on('lctv:presence', this.handleUnavailablePresence.bind(this))
    this.client.on('lctv:mentions', this.handleMentions.bind(this))
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

  /**
   * Handles the public commands.
   *
   * @param string cmd
   * @param array args
   * @param Stanza stanza
   */
  handleCommands(cmd, args, stanza) {
    // retrieve the user and strip the room
    let username = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
    let user = this.createUser(username)
    switch(cmd) {
      case 'help':
        this.client.say('Commands available: !github-link, !project, !views')
        break;
      case 'github-link':
        this.client.say(this.getContent('githubLink'))
        break;
      case 'project':
        this.client.say(this.getContent('projectInfo'))
        break;
      case 'views':
        this.client.say('You have ' + user.getViews() + ' views.')
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
        // Starts the bot
        this.start()
        break;
      case 'echo':
        // echoes what is enterd
        this.client.say(args.join(' '))
        break;
      case 'set-content':
        // retrieve the key and remove the first value
        var key = args.shift()
        var value = args.join(' ')
        this.setContent(key, value)
        Notifications.show(this.botName, 'Updating content (' + key + ') to: ' + value)
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
