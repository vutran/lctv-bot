import storage from 'node-persist'

export default class Store {

  /**
   * Creates a new storage device
   *
   * @param options See https://www.npmjs.com/package/node-persist#options
   */
  constructor(options) {
    this.storage = storage.create(options)
    this.storage.initSync()
  }

  get(key) {
    return this.storage.getItemSync(key)
  }

  set(key, value) {
    return this.storage.setItemSync(key, value)
  }

}
