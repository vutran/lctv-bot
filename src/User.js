'use strict'

export default class User {

  constructor(configs = {}) {
    const defaults = {
      username: '',
      role: 'participant'
    }
    // override defaults
    configs = Object.assign({}, defaults, configs)
    // set properties
    this.setUsername(configs.username)
    this.setRole(configs.role)
  }

  /**
   * Sets the username
   *
   * @param string username
   */
  setUsername(username) {
    this.username = username
  }

  /**
   * Gets the username
   *
   * @return string
   */
  getUsername() {
    return this.username
  }

  /**
   * Retrieve the mention string (Example: "@username")
   *
   * @return string
   */
  getMention() {
    return '@' + this.getUsername()
  }

  /**
   * Sets the user role
   *
   * @param string role
   */
  setRole(role) {
    this.role = role
  }

  /**
   * Retrieves the user's role
   *
   * @return string
   */
  getRole() {
    return this.role
  }

  /**
   * Checks if the user is a moderator
   *
   * @return bool
   */
  isMod() {
    return this.getRole() === 'moderator' ? true : false
  }

}
