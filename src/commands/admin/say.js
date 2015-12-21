'use strict'

import Voice from '../../Voice'

export default function(cmd, args) {

  // say what is entered
  Voice.say(args.join(' '))

}
