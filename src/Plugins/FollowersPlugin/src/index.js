'use strict'

import EventEmitter from 'events'
import util from 'util'
import Watcher from 'rss-watcher'
import Store from '../../../Store'

// import handlers
import {
  handleNewArticle,
  handleError,
  handleRun,
  handleNewFollower
} from './handlers'

export default class FollowersPlugin {

  /**
   * @param string config.url             The URL to your followers RSS feed
   * @param string newFollowerMessage
   */
  constructor(config) {
    console.log('FollowersPlugin loaded')
    this.config = Object.assign({}, config)

    // set the followers storage device
    this.store = new Store({
      dir: 'followers'
    })

    // retrieve users from store or create a new list of users
    this.users = this.store.get('list') || []


    // create the watcher
    const watcher = new Watcher(this.config.url)

    // poll every 5 seconds...
    watcher.set({
      feed: this.config.url,
      interval: 5
    })

    // register events
    watcher.on('new article', handleNewArticle.bind(this))
    watcher.on('error', handleError.bind(this))
    watcher.run(handleRun.bind(this))

    this.on('lctv:follower:new', handleNewFollower.bind(this))

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

  /**
   * Saves the followers list to the store
   */
  save() {
    this.store.set('list', this.getAll())
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * TODO: decouple bot instance
   * @param User user
   * @return string
   */
  getNewFollowerMessage(user) {
    let bot = this.config.bot
    let value = bot.getContent('newFollowerMessage')
    return value.replace(/\%user\%/, user.getUsername())
  }

}

util.inherits(FollowersPlugin, EventEmitter)
