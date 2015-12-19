export default class User {

  constructor() {
    this.views = 0
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
