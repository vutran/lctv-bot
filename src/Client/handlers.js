'use strict'

import debug from 'debug'
import Utils from '../Utils'

export function handleOnline(data) {
  // emits the normal event
  this.emit('online', data)
  // debug('handleOnline()')
}

export function handleConnect(data) {
  // emits the normal event
  this.emit('connect', data)
  // debug('handleConnect()')
}

export function handleDisconnect(data) {
  // emits the normal event
  this.emit('disconnect', data)
  // debug('handleDisconnect()')
}

export function handleReconnect(data) {
  // emits the normal event
  this.emit('reconnect', data)
  // debug('handleReconnect()')
}

export function handleError(error) {
  debug(error);
}

export function handleStanza(stanza) {
  // emits the normal event
  this.emit('stanza', stanza)
  // emits custom event (example: lctv:presence, lctv:message, lctv:iq)
  this.emit('lctv:' + stanza.getName(), stanza)
  // if the message is not yet delivered
  if (stanza.getChild('delay') === undefined) {
    // retrieve the username
    let username = Utils.getUsername(stanza.getAttr('from'))
    // check for commands
    let cmd = Utils.getCommand(stanza.getChildText('body'))
    if (cmd) {
      // retrieve the arguments
      let args = stanza.getChildText('body').substr(cmd.length + 1).trim().split(' ')
      // emits the command event
      this.emit('lctv:cmd', cmd, args, stanza)
      // if the user is an admin
      if (this.getAdmins().indexOf(username) > -1) {
        this.emit('lctv:cmd:admin', cmd, args, stanza)
      }
    }
    // check for all mentions
    if (Utils.hasMentions(stanza.getChildText('body'))) {
      this.emit('lctv:mentions:all', username, stanza)
    }
    // check for self mentions
    if (Utils.hasMentions(stanza.getChildText('body'), this.getMentions())) {
      this.emit('lctv:mentions:self', username, stanza)
    }
  }
}
