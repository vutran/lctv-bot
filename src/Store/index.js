'use strict'

export default class Store {

  /**
   * Creates a new storage device
   *
   * @param name        The name of the collection
   */
  constructor(configs) {
    const defaults = {
      name: 'default'
    }
    this.configs = Object.assign({}, defaults, configs)
  }

  /**
   * Retrieves the name of the collection
   *
   * @return string
   */
  getName() {
    return this.configs.name
  }

  get() {
    // do something...
  }

  set() {
    // do something...
  }

}
