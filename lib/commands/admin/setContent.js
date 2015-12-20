import Notifications from '../../Notifications'

export default function(cmd, args, stanza) {

  // retrieve the key and remove the first value
  let key = args.shift()
  let value = args.join(' ')

  this.setContent(key, value)

  Notifications.show(this.botName, 'Updating content (' + key + ') to: ' + value)

}