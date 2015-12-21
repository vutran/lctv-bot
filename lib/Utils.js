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
   * Checks if the given value was mentioned
   *
   * @param string value
   * @param string mentions
   * @return bool
   */
  static hasMentions(value, mentions) {
    return new RegExp("\@?" + mentions).test(value)
  }

}
