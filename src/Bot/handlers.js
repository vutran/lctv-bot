'use strict'

import Utils from '../Utils'
import Voice from '../Voice'
import Notifications from '../Notifications'

// import commands
import { githubLink, help, project, status, views, website } from '../commands'
import { echo, setContent, start, say } from '../commands/admin'

export function handleTimerTick(tick) {
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
 * Handles the public commands.
 *
 * @param string cmd
 * @param array args
 * @param Stanza stanza
 */
export function handleCommands(cmd, args, stanza) {
  switch(cmd) {
    case 'help':
      help.bind(this, cmd, args, stanza)()
      break;
    case 'githubLink':
      githubLink.bind(this, cmd, args, stanza)()
      break;
    case 'project':
      project.bind(this, cmd, args, stanza)()
      break;
    case 'status':
      status.bind(this, cmd, args, stanza)()
      break
    case 'views':
      views.bind(this, cmd, args, stanza)()
      break;
    case 'website':
      website.bind(this, cmd, args, stanza)()
  }
}

/**
 * Handles the admin commands.
 *
 * @param string cmd
 * @param array args
 * @param Stanza stanza
 */
export function handleAdminCommands(cmd, args, stanza) {
  switch(cmd) {
    case 'start':
      start.bind(this, cmd, args, stanza)()
      break;
    case 'echo':
      echo.bind(this, cmd, args, stanza)()
      break;
    case 'setContent':
      setContent.bind(this, cmd, args, stanza)()
      break;
    case 'say':
      say.bind(this, cmd, args, stanza)()
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
  let username = Utils.getUsername(stanza.getAttr('from'))
  let user = this.createUser(username)
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
  let username = Utils.getUsername(stanza.getAttr('from'))
  let user = this.createUser(username)
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
 * Displays the welcome messages to new users.
 * Adds the user to the users list.
 *
 * @param Stanza stanza
 */
export function handleNewPresence(stanza) {
  if (stanza.getAttr('type') !== "unavailable") {
    // retrieve the username
    let username = Utils.getUsername(stanza.getAttr('from'))
    let user = this.createUser(username)
    // if not own user
    if (user.getUsername() !== this.client.getUsername()) {
      if (user.getViews() > 0) {
        // display in channel
        this.client.say(this.getWelcomeBackMessage(user))
        Voice.say(this.getWelcomeBackMessage(user))
      } else {
        // display in channel
        this.client.say(this.getWelcomeMessage(user))
        Voice.say(this.getWelcomeMessage(user))
      }
      // desktop notification
      let message = user.getUsername() + ' just joined the channel.'
      Notifications.show(this.getContent('botName'), message)
      // if not yet in the users list
      if (!this.users.exists(user.getUsername())) {
        // add user to the users list
        this.users.add(user)
      }
      // make user available
      user.setAvailable()
      // increment user view
      user.view()
      // save user data
      this.saveUser(user)
    }
  }
}

/**
 * Handles all mentions.
 * Display notifications.
 *
 * @param string username
 * @param Stanza stanza
 */
export function handleAllMentions(username, stanza) {
  // retrieve the mentioned users
  let mentioned = Utils.getMentions(stanza.getChildText('body'))
  if (mentioned.length) {
    mentioned.forEach((mentionedUsername) => {
      mentionedUsername = mentionedUsername.substr(1)
      // if mentioned username is in the users collection
      if (this.users.exists(mentionedUsername)) {
        // create the mentioned user
        let mentionedUser = this.createUser(mentionedUsername)
        if (mentionedUser.isAway()) {
          this.client.say(mentionedUsername + ' is currently away.')
        }
      }
    })
  }
}

/**
 * Handles self mentions.
 * Display notifications.
 *
 * @param string username
 * @param Stanza stanza
 */
export function handleSelfMentions(username, stanza) {
  let body = stanza.getChildText('body')
  let message = username + ' mentioned you: ' + body
  Notifications.show(this.getContent('botName'), message)
}
