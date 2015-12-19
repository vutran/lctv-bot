export default class Users {

  constructor(items = []) {
    this.items = items || []
  }

  add(user) {
    this.items.push(user)
  }

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
