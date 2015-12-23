'use strict'

import User from './User'

export default class Users {

  constructor(items = []) {
    this.items = items || []
  }

  /**
   * @param User user
   */
  add(user) {
    this.getAll().push(user)
  }

  /**
   * @param string username
   */
  removeByUsername(username) {
    let i = this.getIndexByUsername(username)
    this.getAll().splice(i, 1)
  }

  /**
   * Replaces the given user with a new instance
   *
   * @param string username
   * @param User user
   */
  replaceByUsername(username, user) {
    let i = this.getIndexByUsername(username)
    // if found
    if (i > -1) {
      // replaces the value at the given index
      this.getAll()[i] = user
    }
  }

  /**
   * Retrieve the index based on the given username
   *
   * @param string username
   */
  getIndexByUsername(username) {
    let i = -1
    this.getAll().forEach((user, key) => {
      if (user instanceof User && user.getUsername() === username) {
        i = key
      }
    })
    return i
  }

  getAll() {
    return this.items
  }

  count() {
    return this.getAll().length
  }

  /**
   * Returns true of the user is already in the list
   *
   * @param string username
   * @return bool
   */
  exists(username) {
    let i = this.getIndexByUsername(username)
    return (i > -1) ? true : false
  }

}
