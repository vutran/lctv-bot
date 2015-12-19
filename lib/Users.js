export default class Users {

  constructor(items = []) {
    this.items = items || []
  }

  /**
   * @param User user
   */
  add(user) {
    this.items.push(user)
  }

  /**
   * @param User user
   */
  remove(user) {
    let i = this.items.indexOf(user)
    this.items.splice(i, 1)
  }

  getAll() {
    return this.items
  }

  count() {
    return this.items.length
  }

  /**
   * Returns true of the user is already in the list
   *
   * @return true
   */
  exists(user) {
    return (this.items.indexOf(user) > -1) ? true : false
  }

}
