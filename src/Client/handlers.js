'use strict'

import Utils from '../Utils'

export function handleOnline(data) {
  // emits the normal event
  this.emit('online', data)
  // console.log('handleOnline()')
}

export function handleConnect(data) {
  // emits the normal event
  this.emit('connect', data)
  // console.log('handleConnect()')
}

export function handleDisconnect(data) {
  // emits the normal event
  this.emit('disconnect', data)
  // console.log('handleDisconnect()')
}

export function handleReconnect(data) {
  // emits the normal event
  this.emit('reconnect', data)
  // console.log('handleReconnect()')
}

export function handleError(error) {
  console.error('%s: %s', 'Client/handler', error);
}

export function handleStanza(stanza) {
  // emits the normal event
  this.emit('stanza', stanza)
  // emits custom event (example: lctv:presence, lctv:message, lctv:iq)
  this.emit('lctv:' + stanza.getName(), stanza)
  // if the message is not yet delivered
  if (stanza.getChild('delay') === undefined) {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    // check for commands
    const cmd = Utils.getCommand(stanza.getChildText('body'))
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
