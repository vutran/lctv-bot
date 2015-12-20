export default function(cmd, args, stanza) {

  // retrieve the username
  let usernameStart = stanza.getAttr('from').indexOf('/') + 1
  let username = stanza.getAttr('from').substr(usernameStart)
  let user = this.createUser(username)

  this.client.say('You have ' + user.getViews() + ' views.')

}
