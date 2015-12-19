import { EventEmitter } from 'events'
import util from 'util'
import moment from 'moment'
import notifier from 'node-notifier'
import XMPPClient from 'node-xmpp-client'
import Users from './Users'

export default class Client {

  constructor(options = {}) {
    let defaults = {
      username: '',
      password: '',
      host: 'livecoding.tv'
    }
    this.started = false
    this.welcomeMessage = 'Welcome %user to the stream.'
    this.users = new Users()
    this.xmpp = null
    this.settings = Object.assign({}, defaults, options)
    EventEmitter.call(this)
  }

  isStarted() {
    return this.started
  }

  getUsername() {
    return this.settings.username
  }

  getPassword() {
    return this.settings.password
  }

  getHost() {
    return this.settings.host
  }

  /**
   * Example: username@livecoding.tv
   */
  getJid() {
    return this.getUsername() + '@' + this.getHost()
  }

  /**
   * Example: username@chat.livecoding.tv
   */
  getRoom() {
    return this.getUsername() + '@chat.' + this.getHost()
  }

  /**
   * Example: username@chat.livecoding.tv/username
   */
  getChannel() {
    return this.getRoom() + '/' + this.getUsername()
  }

  connect() {
    this.xmpp = new XMPPClient({
      jid: this.getJid(),
      password: this.getPassword()
    })
    // register events
    this.xmpp.on('online', this.handleOnline.bind(this))
    this.xmpp.on('connect', this.handleConnect.bind(this))
    this.xmpp.on('disconnect', this.handleDisconnect.bind(this))
    this.xmpp.on('reconnect', this.handleReconnect.bind(this))
    this.xmpp.on('error', this.handleOnline.bind(this))
    this.xmpp.on('stanza', this.handleStanza.bind(this))
    // register custom events
    this.on('lctv:cmd', this.handleCommands.bind(this))
    this.on('lctv:cmd:admin', this.handleAdminCommands.bind(this))
    this.on('lctv:presence', this.handleInitialPresence.bind(this))
    this.on('lctv:presence', this.handleUnavailablePresence.bind(this))
  }

  setWelcomeMessage(message) {
    this.welcomeMessage = message
  }

  /**
   * Replaces variables
   * - %user
   *
   * @param string user
   */
  getWelcomeMessage(user) {
    return this.welcomeMessage.replace(/\%user/, user)
  }

  /**
   * Sets the initial presence
   *
   * @link http://xmpp.org/rfcs/rfc3921.html#presence
   */
  setPresence() {
    let stanza = new XMPPClient.Stanza('presence', {
      from: this.getJid(),
      to: this.getChannel()
    })
    // sends the stanza
    this.send(stanza)
  }

  /**
   * Sends a message to the channel
   *
   * @link http://xmpp.org/rfcs/rfc3921.html#messaging
   */
  say(message) {
    let stanza = new XMPPClient.Stanza('message', {
      to: this.getRoom(),
      from: this.getJid(),
      type: 'groupchat'
    })
    stanza.c('body').t(message)
    // sends the stanza
    this.send(stanza)
    // emits the message event
    this.emit('message', stanza)
  }

  /**
   * Sends the stanza.
   *
   * @param Stanza stanza
   * @param bool debug
   */
  send(stanza, debug = false) {
    if (debug) {
      this.emit('stanza', stanza)
    } else {
      return this.xmpp.send(stanza)
    }
  }

  /**
   * Starts the bot, and begin listening for new
   * welcome messages.
   */
  start() {
    this.started = true
    this.on('lctv:presence', this.handleNewPresence.bind(this))
    console.log('Bot is now started!')
  }

  handleOnline(data) {
    // console.log('handleOnline()')
    this.setPresence()
  }

  handleConnect(data) {
    // console.log('handleConnect()')
  }

  handleDisconnect(data) {
    // console.log('handleDisconnect()')
  }

  handleReconnect(data) {
    // console.log('handleReconnect()')
  }

  handleError(error) {
    console.error(error);
  }

  handleStanza(stanza) {
    // emits the normal event
    this.emit('stanza', stanza)
    // emits custom event (example: lctv:presence, lctv:message, lctv:iq)
    this.emit('lctv:' + stanza.getName(), stanza)
    // if the message is not yet delivered
    if (stanza.getChild('delay') === undefined) {
      // check for commands
      let cmds = new RegExp(/(^\![\w\d-]+)/).exec(stanza.getChildText('body'))
      if (cmds) {
        // strip leading "!"
        let cmd = cmds[0].substr(1)
        let cmdStart = cmds[0].length
        // retrieve the arguments
        let args = stanza.getChildText('body').substr(cmdStart).trim().split(' ')
        // emits the command event
        this.emit('lctv:cmd', cmd, args, stanza)
        // if the user is admin
        if (stanza.getAttr('from').replace(this.getRoom() + '/', '') === this.getUsername()) {
          this.emit('lctv:cmd:admin', cmd, args, stanza)
        }
      }
    }
  }

  /**
   * Handles the public commands.
   */
  handleCommands(cmd, args, stanza) {
    // retrieve the user and strip the room
    let user = stanza.getAttr('from').replace(this.getRoom() + '/', '')
    switch(cmd) {
      case 'help':
        this.say('Not yet available.')
        break;
      case 'github-link':
        this.say('https://github.com/vutran/lctv-bot')
        break;
    }
  }

  /**
   * Handles the admin commands.
   */
  handleAdminCommands(cmd, args, stanza) {
    // retrieve the user and strip the room
    let user = stanza.getAttr('from').replace(this.getRoom() + '/', '')
    switch(cmd) {
      case 'start':
        // Starts the bot
        this.start()
        break;
      case 'set-welcome-message':
        // Sets the welcome message
        let message = args.join(' ')
        this.setWelcomeMessage(message)
        console.log('Updating the welcome mesage: ' + message)
        break;
      }
  }

  /**
   * Handles the initial presence.
   * Adds the initial users to the users list.
   */
  handleInitialPresence(stanza) {
    // retrieve the user and strip the room
    let user = stanza.getAttr('from').replace(this.getRoom() + '/', '')
    // if not yet in the users list
    if (!this.users.exists(user)) {
      // add user to the users list
      this.users.add(user)
    }
  }

  /**
   * Handles the unavailable presense (when a user leaves).
   * Removes the user from the users list
   */
  handleUnavailablePresence(stanza) {
    // retrieve the user and strip the room
    let user = stanza.getAttr('from').replace(this.getRoom() + '/', '')
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
   */
  handleNewPresence(stanza) {
    if (stanza.getAttr('type') !== "unavailable") {
      // retrieve the user and strip the room
      let user = stanza.getAttr('from').replace(this.getRoom() + '/', '')
      // if not own user
      if (user !== this.getUsername()) {
        // display in channel
        this.say(this.getWelcomeMessage(user))
        // desktop notification
        notifier.notify({
          title: 'LCTV Bot',
          message: user + ' just joined the channel.'
        })
        // if not yet in the users list
        if (!this.users.exists(user)) {
          // add user to the users list
          this.users.add(user)
        }
      }
    }
  }

}

util.inherits(Client, EventEmitter)
