import { EventEmitter } from 'events'
import util from 'util'
import Watcher from 'rss-watcher'

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
    watcher.on('new article', this.handleNewArticle.bind(this))
    watcher.on('error', this.handleError.bind(this))
    watcher.run(this.handleRun.bind(this))

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

  handleError(error) {
    this.emit('lctv:follower:error', error)
    console.error(error)
  }

  handleNewArticle(item) {
    this.emit('lctv:follower:new', item)
  }

  handleRun(error, articles) {
    this.emit('lctv:follower:run', error, articles)
    if (error) {
      console.error(error)
    }
    if (articles && articles.length) {
      // set changed flag
      let changed = false
      // iterate through all
      articles.forEach((item, key) => {
        // if not yet in the list
        if (!this.exists(item.title)) {
          // add to users list
          this.add(item.title)
          changed = true
        }
      })
      if (changed) {
        // save to store
        this.save()
      }
    }
  }

}

util.inherits(Followers, EventEmitter)
