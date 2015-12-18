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
    this.startTime = new Date().getTime()
    this.xmpp = null
    this.settings = Object.assign({}, defaults, options)
    EventEmitter.call(this)
  }

  getStartTime() {
    return this.startTime
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
    this.xmpp.on('online', this.handleOnline.bind(this))
    this.xmpp.on('error', this.handleOnline.bind(this))
    this.xmpp.on('stanza', this.handleStanza.bind(this))
  }

  handleOnline(data) {
    this.setPresence()
  }

  handleError(error) {
    console.error(error);
  }

  handleStanza(stanza) {
    // emits the message event
    this.emit('stanza', stanza)
  }

  /**
   * Sets the initial presence
   *
   * @link http://xmpp.org/rfcs/rfc3921.html#presence
   */
  setPresence() {
    let stanza = new XMPPClient.Stanza('presence', {
      to: this.getChannel()
    })
    this.xmpp.send(stanza)
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
    // this.xmpp.send(stanza)
    // emits the message event
    this.emit('message', stanza)
  }

}

util.inherits(Client, EventEmitter)
