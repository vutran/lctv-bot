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
    this.store = new Store()

    // set default values
    this.started = false
    this.botName = 'LCTV Bot'
    this.welcomeMessage = this.store.get('welcome-message') || 'Welcome %user% to the stream.'

    // connect the Client
    this.client.connect()

    // register custom events
    this.client.on('lctv:cmd', this.handleCommands.bind(this))
    this.client.on('lctv:cmd:admin', this.handleAdminCommands.bind(this))
    this.client.on('lctv:presence', this.handleInitialPresence.bind(this))
    this.client.on('lctv:presence', this.handleUnavailablePresence.bind(this))
  }

  /**
   * Starts the bot.
   * Begins listening for new presences.
   */
  start() {
    this.started = true
    this.client.on('lctv:presence', this.handleNewPresence.bind(this))
    Notifications.show(this.botName, 'Bot is now started!')
  }

  /**
   * @return bool
   */
  isStarted() {
    return this.started
  }

  /**
   * Sets the welcome message
   *
   * @param string message
   */
  setWelcomeMessage(message) {
    this.welcomeMessage = message
    // save message to store
    this.store.set('welcome-message', message)
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param string user
   */
  getWelcomeMessage(user) {
    return this.welcomeMessage.replace(/\%user\%/, user)
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
    let user = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
    switch(cmd) {
      case 'help':
        this.client.say('Commands available: !github-link')
        break;
      case 'github-link':
        this.client.say('https://github.com/vutran/lctv-bot')
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
    // retrieve the user and strip the room
    let user = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
    switch(cmd) {
      case 'start':
        // Starts the bot
        this.start()
        break;
      case 'set-welcome-message':
        // Sets the welcome message
        let message = args.join(' ')
        this.setWelcomeMessage(message)
        Notifications.show(this.botName, 'Updating the welcome mesage to: ' + message)
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
    let user = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
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
    let user = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
    if (stanza.getAttr('type') === "unavailable") {
      // if in the users list
      if (this.users.exists(user)) {
        // remove user to the users list
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
      // retrieve the user and strip the room
      let user = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
      // if not own user
      if (user !== this.client.getUsername()) {
        // display in channel
        this.client.say(this.getWelcomeMessage(user))
        // desktop notification
        let message = user + ' just joined the channel.'
        Notifications.show(this.botName, message)
        // if not yet in the users list
        if (!this.users.exists(user)) {
          // add user to the users list
          this.users.add(user)
        }
      }
    }
  }

}
