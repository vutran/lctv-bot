import Voice from '../../Voice'

export default function(cmd, args, stanza) {

  // say what is entered
  Voice.say(args.join(' '))

}
