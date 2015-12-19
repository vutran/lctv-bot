import { EventEmitter } from 'events'
import util from 'util'
import XMPPClient from 'node-xmpp-client'

export default class Client {

  constructor(options = {}) {
    let defaults = {
      username: '',
      password: '',
      host: 'livecoding.tv'
    }
    this.xmpp = null
    this.settings = Object.assign({}, defaults, options)
    EventEmitter.call(this)
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
   * @param string message
   * @link http://xmpp.org/rfcs/rfc3921.html#messaging
   */
  say(message) {
    let stanza = new XMPPClient.Stanza('message', {
      to: this.getRoom(),
      from: this.getJid(),
      type: 'groupchat'
    })
    stanza.c('body').t('[BOT] ' + message)
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

}

util.inherits(Client, EventEmitter)
