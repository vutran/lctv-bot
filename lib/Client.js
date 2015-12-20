import { EventEmitter } from 'events'
import util from 'util'
import XMPPClient from 'node-xmpp-client'

export default class Client {

  constructor(options = {}) {
    let defaults = {
      username: '',
      password: '',
      host: 'livecoding.tv',
      mentions: []
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
   * Joins the specified channel
   *
   * @param string channel
   */
  join(channel) {
    let channelJid = channel + '@chat.' + this.getHost() + '/' + this.getUsername()
    this.setPresence(channelJid)
  }

  /**
   * Sets the initial presence for the given channel
   *
   * @link http://xmpp.org/rfcs/rfc3921.html#presence
   * @param string channelJid       The full channel JID (Example: channel@chat.livecoding.tv/username)
   */
  setPresence(channelJid) {
    let stanza = new XMPPClient.Stanza('presence', {
      from: this.getJid(),
      to: channelJid
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
  say(message, type = 'groupchat') {
    let stanza = new XMPPClient.Stanza('message', {
      to: this.getRoom(),
      from: this.getJid(),
      type: type
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
    // emits the normal event
    this.emit('online', data)
    // console.log('handleOnline()')
  }

  handleConnect(data) {
    // emits the normal event
    this.emit('connect', data)
    // console.log('handleConnect()')
  }

  handleDisconnect(data) {
    // emits the normal event
    this.emit('disconnect', data)
    // console.log('handleDisconnect()')
  }

  handleReconnect(data) {
    // emits the normal event
    this.emit('reconnect', data)
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
      // check for mentions
      let mentions = new RegExp("\@?" + this.getMentions()).test(stanza.getChildText('body'))
      if (mentions) {
        // retrieve the username
        let usernameStart = stanza.getAttr('from').indexOf('/') + 1
        let username = stanza.getAttr('from').substr(usernameStart)
        this.emit('lctv:mentions', username, stanza)
      }
    }
  }

}

util.inherits(Client, EventEmitter)
