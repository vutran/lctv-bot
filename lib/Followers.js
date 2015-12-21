import { EventEmitter } from 'events'
import util from 'util'
import Watcher from 'rss-watcher'
import Store from './Store'
import Users from './Users'

export default class Followers {

  constructor(url) {
    this.url = url

    // create new storage device
    this.store = new Store({
      dir: 'followers'
    })

    // retrieve users from store or create a new list of users
    let usersList = this.store.get('followers') || []
    // wrap into Users collection
    this.users = new Users(usersList)

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

  handleError(error) {
    console.error(error)
  }

  handleNewArticle(item) {
    // if not yet in collection
    if (!this.users.exists(item.title)) {
      // add to users collection
      this.users.add(item.title)
      // save to store
      this.store.set('followers', this.users.getAll())
      // event the event
      this.emit('lctv:new-follower', item.title)
    }
  }

  handleRun(error, articles) {
    if (error) {
      console.error(error)
    }
    // set changed flag
    let changed = false
    // iterate through all
    articles.forEach((item, key) => {
      // if not yet in collection
      if (!this.users.exists(item.title)) {
        // add to users collection
        this.users.add(item.title)
        changed = true
      }
    })
    if (changed) {
      // save to store
      this.store.set('followers', this.users.getAll())
    }
  }

}

util.inherits(Followers, EventEmitter)
