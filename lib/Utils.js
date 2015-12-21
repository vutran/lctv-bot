'use strict'

export default class Utils {

  /**
   * Strips the user name from the full JID resource string
   */
  static getUsername(value) {
    // retrieve the username
    let start = value.indexOf('/') + 1
    return value.substr(start)
  }

  /**
   * @param string
   * @return array
   */
  static getCommands(value) {
    return new RegExp(/(^\![\w\d-]+)/).exec(value)
  }
  /**
   * @param string
   * @return string
   */
  static getCommand(value) {
    let cmds = Utils.getCommands(value)
    if (cmds) {
      return cmds[0].substr(1)
    }
  }

  /**
   * Retrieves a list containing the first found mention
   *
   * @return array
   */
  static getMentions(value) {
    return new RegExp(/@[\w\d]+/).exec(value) || []
  }

  /**
   * Checks if the given value was mentioned
   *
   * @param string value
   * @param string mentions
   * @return bool
   */
  static hasMentions(value, mentions = '') {
    let mentionsArr = Utils.getMentions(value)
    if (mentionsArr.length) {
      if (mentions.length) {
        return mentionsArr.indexOf(mentions) > -1 ? true : false
      } else {
        return true
      }
    }
    return false
  }

}
