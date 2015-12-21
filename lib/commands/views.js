import Utils from '../Utils'

export default function(cmd, args, stanza) {

  // retrieve the username
  let username = Utils.getUsername(stanza.getAttr('from'))
  let user = this.createUser(username)

  this.client.say('You have ' + user.getViews() + ' views.')

}
