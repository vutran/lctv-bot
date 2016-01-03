'use strict'

import Utils from '../Utils'

export function handleTimerTick(tick) {
  // emit event on the client
  this.emit('lctv:timer:tick', tick)
  // if (tick % 10 === 0) {
  //   if (this.client) {
  //     this.client.ping()
  //   }
  // }
}

export function handleOnline() {
  // Joins the given channel
  this.join(this.getChannel())
}

/**
 * Handles the admin commands.
 *
 * @param string cmd
 * @param array args
 * @param Stanza stanza
 */
export function handleAdminCommands(cmd) {
  switch(cmd) {
    case 'start':
      // starts the bot
      this.start()
      break;
  }
}

/**
 * Handles the initial presence.
 * Adds the initial users to the users list.
 *
 * @param Stanza stanza
 */
export function handleInitialPresence(stanza) {
  // retrieve the username
  const username = Utils.getUsername(stanza.getAttr('from'))
  this.retrieveUser(username, {}, (user) => {
    // if not yet in the users list
    if (!this.getUsers().exists(user.getUsername())) {
      // add user to the users list
      this.getUsers().add(user)
      // emit initial presence event
      this.emit('lctv:channel:initial', user)
    }
  })
}

/**
 * Handles the unavailable presense (when a user leaves).
 * Removes the user from the users list
 *
 * @param Stanza stanza
 */
export function handleUnavailablePresence(stanza) {
  // if the user left the channel
  if (stanza.getAttr('type') === "unavailable") {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    this.retrieveUser(username, {}, (user) => {
      // emit parting event
      this.emit('lctv:channel:part', user)
      // remove user from the users list
      this.getUsers().removeByUsername(username)
    })
  }
}

/**
 * Handles the new presence.
 * Adds the user to the users list.
 *
 * @param Stanza stanza
 */
export function handleNewPresence(stanza) {
  if (stanza.getAttr('type') !== "unavailable") {
    // retrieve the username
    const username = Utils.getUsername(stanza.getAttr('from'))
    const options = {
      role: stanza.getChild('x').getChildElements()[0].getAttr('role')
    }
    this.retrieveUser(username, options, (user) => {
      // emit the new channel join event
      this.emit('lctv:channel:join', user)
      // add user to the users list
      this.getUsers().add(user)
    })
  }
}
