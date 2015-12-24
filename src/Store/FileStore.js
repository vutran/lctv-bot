'use strict'

import storage from 'node-persist'
import Store from './index'

export default class FileStore extends Store {

  /**
   * Creates a new storage device
   *
   * @link See https://www.npmjs.com/package/node-persist#options
   * @param configs
   */
  constructor(configs) {
    super(configs)
    this.configs = Object.assign({}, this.configs, configs)
    // map to the node-persist configurations
    const persistConfigs = {
      dir: configs.name
    }
    // create the persistent storage
    this.storage = storage.create(persistConfigs)
    this.storage.initSync()
  }

  get(key, callback) {
    return this.storage.getItem(key, callback)
  }

  getSync(key) {
    return this.storage.getItemSync(key)
  }

  set(key, value, callback) {
    return this.storage.setItem(key, value, callback)
  }

  setSync(key, value) {
    return this.storage.setItemSync(key, value)
  }

}
