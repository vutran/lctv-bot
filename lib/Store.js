import storage from 'node-persist'

export default class Store {

  constructor() {
    storage.initSync()
  }

  get(key) {
    return storage.getItemSync(key)
  }

  set(key, value) {
    return storage.setItemSync(key, value)
  }

}
