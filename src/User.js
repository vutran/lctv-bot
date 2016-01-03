'use strict'

export default class User {

  constructor(configs = {}) {
    const defaults = {
      username: '',
      voiceName: '',
      views: 0,
      watchTime: 0,
      role: 'participant',
      status: 'available',
      awayMessage: ''
    }
    // override defaults
    configs = Object.assign({}, defaults, configs)
    // set properties
    this.setUsername(configs.username)
    this.setVoiceName(configs.voiceName || configs.username)
    this.setViews(configs.views)
    this.setWatchTime(configs.watchTime)
    this.setRole(configs.role)
    this.setStatus(configs.status)
    this.setAwayMessage(configs.awayMessage)
  }

  setUsername(username) {
    this.username = username
  }

  getUsername() {
    return this.username
  }

  setVoiceName(voiceName) {
    this.voiceName = voiceName
  }

  getVoiceName() {
    return this.voiceName
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
   * Sets the number of seconds the user has watched the stream
   *
   * @param int watchTime     Time watched in seconds
   */
  setWatchTime(watchTime) {
    this.watchTime = watchTime
  }

  getWatchTime() {
    return this.watchTime
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

  /**
   * @param string message
   */
  setAwayMessage(message = '') {
    this.awayMessage = message
  }

  getAwayMessage() {
    return this.awayMessage
  }

  /**
   * @param string message
   */
  setAway(message = '') {
    this.setStatus('away')
    this.setAwayMessage(message)
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

  setRole(role) {
    this.role = role
  }

  getRole() {
    return this.role
  }

  isMod() {
    return this.getRole() === 'moderator' ? true : false
  }

}
