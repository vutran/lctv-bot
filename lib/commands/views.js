export default function(cmd, args, stanza) {

  // retrieve the user and strip the room
  let username = stanza.getAttr('from').replace(this.client.getRoom() + '/', '')
  let user = this.createUser(username)

  this.client.say('You have ' + user.getViews() + ' views.')

}
