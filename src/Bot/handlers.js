'use strict'

import Utils from '../Utils'

export function handleTimerTick(tick) {
  // emit event on the client
  this.client.emit('lctv:timer:tick', tick)
  if (tick % 5 === 0) {
    if (this.client) {
      this.client.ping()
    }
  }
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
  const user = this.createUser(username)
  // if not yet in the users list
  if (!this.users.exists(user.getUsername())) {
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
export function handleUnavailablePresence(stanza) {
  // retrieve the username
  const username = Utils.getUsername(stanza.getAttr('from'))
  const user = this.createUser(username)
  if (stanza.getAttr('type') === "unavailable") {
    // if in the users list
    if (this.users.exists(user.getUsername())) {
      // remove user from the users list
      this.users.removeByUsername(user.getUsername())
    }
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
    const user = this.createUser(username)
    // if not own user
    if (user.getUsername() !== this.client.getUsername()) {
      // emit the new channel join event
      this.client.emit('lctv:channel:join', user)
      // if not yet in the users list
      if (!this.users.exists(user.getUsername())) {
        // add user to the users list
        this.users.add(user)
      }
    }
  }
}
