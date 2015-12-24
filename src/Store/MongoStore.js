'use strict'

import { MongoClient } from 'mongodb'
import Store from './index'

export default class MongoStore extends Store {

  constructor(configs = {}) {
    super(configs)
    const defaults = {
      host: 'mongodb://localhost:27017'
    }
    this.configs = Object.assign({}, this.configs, defaults, configs)
    // connect to the mongo db
    this.connect()
  }

  /**
   * Connects to the database and runs the callback
   *
   * @param function callback
   */
  connect(callback) {
    MongoClient.connect(this.configs.host, callback)
  }

  getHost() {
    return this.configs.host
  }

  /**
   * Returns the mongodb collection
   */
  getCollection(db) {
    return db.collection(this.getName())
  }

  // get(key, callback) {
  //   this.connect((err, db) => {
  //     if (!err) {
  //       // retrieve the document collection
  //       const collection = this.getCollection()
  //       // retrieve the key in the collection
  //       collection.find({key: key}, (err, results) {
  //         console.log(results)
  //       })
  //     }
  //   })
  // }
  //
  // set(key, value, callback) {
  //   this.connect(err, db) => {
  //     if (!err) {
  //       // retrieve the document collection
  //       const collection = this.getCollection()
  //       // set a value where the key exists
  //       collection.updateOne({ key }, { $set: { value } }, (err, results) => {
  //         console.log(results)
  //       })
  //     }
  //   })
  // }

}
