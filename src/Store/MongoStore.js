'use strict'

import co from 'co'
import { MongoClient } from 'mongodb'
import Store from './index'

export default class MongoStore extends Store {

  /**
   * Creates a new Mongo store
   *
   * @param configs.name      The name of the document
   * @param configs.host      The mongo DB host
   */
  constructor(configs = {}) {
    super(configs)
    const defaults = {
      host: 'mongodb://localhost:27017'
    }
    this.configs = Object.assign({}, this.configs, defaults, configs)
    console.log('createStore:', configs.name)
  }

  /**
   * Connects to the database and runs the callback
   *
   * @param function callback
   */
  connect(callback) {
    return MongoClient.connect(this.configs.host, callback)
  }

  /**
   * Retrieves the mongo host
   *
   * @return string
   */
  getHost() {
    return this.configs.host
  }

  /**
   * Returns the mongodb collection
   */
  getCollection(db) {
    return db.collection(this.getName())
  }

  /**
   * Asynchronously retrieves an object from the store
   *
   * @param string key
   * @param function callback
   */
  get(key, callback = function() { }) {
    co(function*() {
      const db = yield this.connect()
      const collection = this.getCollection(db)
      const where = { key }
      // retrieve the document
      const results = yield collection.findOne(where)
      // close the connection
      db.close()
      // run callback
      callback.call(null, null, results ? results.value : null)
    }.bind(this)).catch(this.handleError.bind(this))
  }

  /**
   * Asynchronously inserts/updates the given key with the value
   *
   * @param string key
   * @param mixed value
   * @param function callback
   */
  set(key, value, callback = function() { }) {
    co(function*() {
      const db = yield this.connect()
      const collection = this.getCollection(db)
      const where = { key }
      const updates = { $set: { value } }
      // retrieve the document
      const results = yield collection.updateOne(where, updates, {upsert:true})
      // close the connection
      db.close()
      // run callback
      callback.call(null, null, results ? results.value : null)
    }.bind(this)).catch(this.handleError.bind(this))
  }

  handleError(error) {
    console.error('%s: %s', 'MongoStore', error)
  }

}
