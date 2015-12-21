'use strict'

export default class User {

  constructor(username, views = 0, status = 'available') {
    this.username = username
    this.views = views
    this.setStatus(status)
  }

  getUsername() {
    return this.username
  }

  getMention() {
    return '@' + this.getUsername()
  }

  setViews(views) {
    this.views = views
  }

  getViews() {
    return this.views
  }

  /**
   * Increments the visits counter
   *
   * @return void
   */
  view() {
    this.views++
  }

  setStatus(status) {
    this.status = status
  }

  getStatus() {
    return this.status
  }

  setAway() {
    this.setStatus('away')
  }

  setAvailable() {
    this.setStatus('available')
  }

  isAway() {
    return this.getStatus() === 'away' ? true : false
  }

  isAvailable() {
    return this.getStatus() === 'available' ? true : false
  }

}
