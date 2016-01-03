'use strict'

import EventEmitter from 'events'
import XMPPClient from 'node-xmpp-client'

// import handlers
import {
  handleOnline,
  handleConnect,
  handleDisconnect,
  handleReconnect,
  handleStanza
} from './handlers'

export default class Client extends EventEmitter {

  constructor(options = {}) {
    super(options)
    this.setMaxListeners(50)
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
    this.xmpp.on('online', handleOnline.bind(this))
    this.xmpp.on('connect', handleConnect.bind(this))
    this.xmpp.on('disconnect', handleDisconnect.bind(this))
    this.xmpp.on('reconnect', handleReconnect.bind(this))
    this.xmpp.on('error', handleOnline.bind(this))
    this.xmpp.on('stanza', handleStanza.bind(this))
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
  setPresence(channelJid, options = {}) {
    const defaults = {
      from: this.getJid(),
      to: channelJid
    }
    options = Object.assign({}, defaults, options)
    const stanza = new XMPPClient.Stanza('presence', options)
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

  leave(channel) {
    // parse the channel jid
    let channelJid = channel + '@chat.' + this.getHost() + '/' + this.getUsername()
    // sets the channel presence
    this.setPresence(channelJid, { type: 'unavailable' })
    // add to joined channels list
    this.joinedChannels.splice(this.joinedChannels.indexOf(channel), 1)
  }

  /**
   * Sends a ping to the channel resource to avoid becoming idle
   */
  ping() {
    if (this.joinedChannels.length) {
      // parse the channel jid
      let channelJid = this.joinedChannels[0] + '@chat.' + this.getHost() + '/' + this.getUsername()
      this.setPresence(channelJid)
    }
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

}
