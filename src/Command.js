'use strict'

export default class Command {

  /**
   * @param string name           The name of the command
   * @param string description    A short description of the command
   * @param function handler      A callback function for the command; passed parameters: (cmd, args, stanza)
   */
  constructor(name, description, handler) {
    this.name = name
    this.description = description
    this.handler = handler
  }

  getName() {
    return this.name
  }

  getDescription() {
    return this.description
  }

  getHandler() {
    return this.handler
  }

  /**
   * Executes the command if it matches the command name
   *
   * @param string cmd
   * @param array args
   * @param Stanza stanza
   */
  exec(cmd, args, stanza) {
    if (cmd === this.getName()) {
      this.getHandler().call(this, cmd, args, stanza)
    }
  }

}
