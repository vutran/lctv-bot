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
   * Retrieves a list of the first found command (Example: !command)
   *
   * @param string
   * @return array
   */
  static getCommands(value) {
    let commands = new RegExp(/(^\![\w\d-]+)/).exec(value)
    return (commands && commands.length > 0) ? commands : []
  }

  /**
   * Retrieves the first command as a string (Example: command)
   *
   * @param string
   * @return string
   */
  static getCommand(value) {
    let cmds = Utils.getCommands(value)
    if (cmds.length) {
      return cmds[0].substr(1)
    }
    return ''
  }

  /**
   * Retrieves a list containing the first found mention
   *
   * @return array
   */
  static getMentions(value) {
    let mentions = new RegExp(/@[\w\d]+/).exec(value) || []
    return (mentions && mentions.length) ? mentions : []
  }

  /**
   * Checks if the given value was mentioned
   * If mentions are set, checks for the specified mentioned
   * If mentions isn't set, checks for any mentions
   *
   * @param string value
   * @param string mentions     (Example: "@vutran")
   * @return bool
   */
  static hasMentions(value, mentions = '') {
    let mentionsArr = Utils.getMentions(value)
    if (mentionsArr.length) {
      // if mentions are set
      if (mentions) {
        // return true if found, else false
        return mentionsArr.indexOf(mentions) > -1 ? true : false
      }
      return true
    }
    return false
  }

}
