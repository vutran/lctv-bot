export default class User {

  constructor(username, views = 0) {
    this.username = username
    this.views = views
  }

  getUsername() {
    return this.username
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

}
