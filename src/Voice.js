'use strict'

import say from 'say'

export default class Voice {

  static say(message) {
    say.speak(null, message);
  }

}
