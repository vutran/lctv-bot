import { EventEmitter } from 'events'
import util from 'util'
import XMPPClient from 'node-xmpp-client'

export default class Client {

  constructor(options = {}) {
    let defaults = {
      username: '',
      password: '',
      host: 'livecoding.tv',
      mentions: [],
      admins: []
    }
    this.xmpp = null
    this.settings = Object.assign({}, defaults, options)
    // joined channels
    this.joinedChannels = []
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
   * Sets the list of admins
   *
   * @param array admins
   */
  setAdmins(admins) {
    this.admins = admins
  }

  /**
   * Retrieve the list of admins
   *
   * @return array
   */
  getAdmins() {
    return this.admins
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
   * Joins the specified channel
   *
   * @param string channel
   */
  join(channel) {
    // parse the channel jid
    let channelJid = channel + '@chat.' + this.getHost() + '/' + this.getUsername()
    // sets the channel presence
    this.setPresence(channelJid)
    // add to joined channels list
    this.joinedChannels.push(channel)
  }

  /**
   * Sends a message to the channel
   *
   * @param string message
   * @link http://xmpp.org/rfcs/rfc3921.html#messaging
   */
  say(message, type = 'groupchat') {
    let channelJid = this.joinedChannels[0] + '@chat.' + this.getHost()
    let stanza = new XMPPClient.Stanza('message', {
      to: channelJid,
      from: this.getJid(),
      type: type
    })
    stanza.c('body').t(message)
    // sends the stanza
    this.send(stanza)
    // emits the message event
    this.emit('message', stanza)
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
      // retrieve the username
      let usernameStart = stanza.getAttr('from').indexOf('/') + 1
      let username = stanza.getAttr('from').substr(usernameStart)
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
        // if the user is an admin
        if (this.getAdmins().indexOf(username) > -1) {
          this.emit('lctv:cmd:admin', cmd, args, stanza)
        }
      }
      // check for mentions
      let mentions = new RegExp("\@?" + this.getMentions()).test(stanza.getChildText('body'))
      if (mentions) {
        this.emit('lctv:mentions', username, stanza)
      }
    }
  }

}

util.inherits(Client, EventEmitter)
