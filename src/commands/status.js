'use strict'

import Utils from '../Utils'

export default function(cmd, args, stanza) {

  // retrieve the new status
  let newStatus = args[0]

  if (!newStatus ) {
    // no status is set, display the help
    this.client.say('Please specify a status (Example: !status <away|available>).')
  } else {
    // retrieve the username
    let username = Utils.getUsername(stanza.getAttr('from'))
    let user = this.createUser(username)

    let availableStatus = ['away', 'available']

    // if a valid status
    if (availableStatus.indexOf(newStatus) > -1) {
      switch(newStatus) {
        case 'away':
          user.setAway()
          break
        case 'available':
          user.setAvailable()
          break
      }
    }

    // save the user
    this.saveUser(user)
  }
}
