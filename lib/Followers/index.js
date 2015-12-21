import { EventEmitter } from 'events'
import util from 'util'
import Watcher from 'rss-watcher'

// import handlers
import { handleNewArticle, handleError, handleRun } from './handlers'

export default class Followers {

  constructor(url, store) {
    this.url = url

    // set the followers storage device
    this.store = store

    // retrieve users from store or create a new list of users
    this.users = this.store.get('list') || []

    // create the watcher
    let watcher = new Watcher(url)

    // poll every 5 seconds...
    watcher.set({
      feed: url,
      interval: 5
    })

    // register events
    watcher.on('new article', handleNewArticle.bind(this))
    watcher.on('error', handleError.bind(this))
    watcher.run(handleRun.bind(this))

    EventEmitter.call(this)
  }

  /**
   * Retrieve the full list of usernames
   *
   * @return Users
   */
  getAll() {
    return this.users
  }

  /**
   * Checks if the given username is already following
   *
   * @param string username
   * @return bool
   */
  exists(username) {
    return this.users.indexOf(username) > -1 ? true : false
  }

  /**
   * Adds a username to the followers list
   *
   * @param string user
   */
  add(username) {
    this.users.push(username)
  }

  save() {
    this.store.set('list', this.getAll())
  }

}

util.inherits(Followers, EventEmitter)
