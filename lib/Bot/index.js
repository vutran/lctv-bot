import Client from '../Client'
import Users from '../Users'
import User from '../User'
import Followers from '../Followers'
import Store from '../Store'
import Notifications from '../Notifications'
import Timer from '../Timer'

// import handlers
import {
  handleTimerTick,
  handleOnline,
  handleCommands,
  handleAdminCommands,
  handleInitialPresence,
  handleUnavailablePresence,
  handleNewPresence,
  handleAllMentions,
  handleSelfMentions,
  handleNewFollower
} from './handlers'

export default class Bot {

  /**
   * @param object config
   * @param Client config.client          An instance of Client
   * @param Users config.users            An instance of Users
   * @param string config.channel         The name of the channel to join
   * @param array config.mentions         A list of strings to watch for
   * @param array config.admins           A list of admins
   * @param string config.followersUrl    The URL to the followers RSS feed
   */
  constructor(config) {
    this.client = config.client
    this.users = config.users || new Users()
    this.setChannel(config.channel)
    this.setMentions(config.mentions)
    this.setAdmins(config.admins)
    this.setFollowersUrl(config.followersUrl)

    // create a timer
    this.timer = new Timer()
    this.timer.on('lctv:timer:tick', handleTimerTick.bind(this))

    // create new storage device
    this.store = new Store({
      dir: 'general'
    })
    this.userStore = new Store({
      dir: 'user'
    })
    this.followersStore = new Store({
      dir: 'followers'
    })

    // create a the Followers and listen for new followers
    this.followers = new Followers(this.getFollowersUrl(), this.followersStore)
    this.followers.on('lctv:follower:new', handleNewFollower.bind(this))

    // set default values
    this.started = false
    this.defaultContent = {
      botName: 'LCTV Bot',
      githubLink: 'https://github.com/vutran/lctv-bot',
      projectInfo: 'Not yet available.',
      welcomeBackMessage: 'Welcome back %user%.',
      welcomeMessage: 'Welcome %user% to the stream.',
      newFollowerMessage: 'Thank you for following me, %user%.'
    }
    this.content = this.store.get('content') || this.defaultContent

    // register custom events
    this.client.on('online', handleOnline.bind(this))
    this.client.on('lctv:cmd', handleCommands.bind(this))
    this.client.on('lctv:cmd:admin', handleAdminCommands.bind(this))
    this.client.on('lctv:presence', handleInitialPresence.bind(this))
    this.client.on('lctv:presence', handleUnavailablePresence.bind(this))
    this.client.on('lctv:mentions:all', handleAllMentions.bind(this))
    this.client.on('lctv:mentions:self', handleSelfMentions.bind(this))

    // starts the timer
    this.timer.start()

    // connect the Client
    this.client.connect()
  }

  /**
   * Sets the channel to join
   *
   * @param string channel
   */
  setChannel(channel) {
    this.channel = channel
  }

  /**
   * Retrieve the channel to join
   *
   * @return string
   */
  getChannel() {
    return this.channel
  }

  /**
   * Sets the mentions to watch
   *
   * @param array mentions
   */
  setMentions(mentions) {
    this.mentions = mentions
    this.client.setMentions(mentions)
  }

  /**
   * Retrieve the list of mentions
   *
   * @return array
   */
  getMentions() {
    return this.mentions
  }

  /**
   * Sets the list of admins
   *
   * @param array admins
   */
  setAdmins(admins) {
    this.admins = admins
    this.client.setAdmins(admins)
  }

  /**
   * Retrieve the list of admins
   *
   * @return array
   */
  getAdmins() {
    return this.admins
  }

  /**
   * Sets the followers feed RSS URL
   *
   * @param string followersURl
   */
  setFollowersUrl(followersUrl) {
    this.followersUrl = followersUrl
  }

  /**
   * Retrieve the followers feed RSS URL
   *
   * @return string
   */
  getFollowersUrl() {
    return this.followersUrl
  }

  /**
   * Starts the bot.
   * Begins listening for new presences.
   */
  start() {
    if (!this.isStarted()) {
      this.started = true
      this.client.on('lctv:presence', handleNewPresence.bind(this))
      Notifications.show(this.getContent('botName'), 'Bot is now started!')
    }
  }

  /**
   * @return bool
   */
  isStarted() {
    return this.started
  }

  /**
   * Joins the channel specified by a channel name
   *
   * @param string channel
   */
  join(channel) {
    this.client.join(channel)
  }

  /**
   * Sets the content value
   *
   * @param string key
   * @param mixed value
   */
  setContent(key, value) {
    this.content[key] = value
    // save to store
    this.store.set('content', this.content)
  }

  /**
   * Retrieves the content value
   *
   * @param string key
   * @return mixed
   */
  getContent(key) {
    return this.content[key]
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  getWelcomeMessage(user) {
    let value = this.getContent('welcomeMessage')
    return value.replace(/\%user\%/, user.getUsername())
  }

  /**
   * Replaces variables:
   *
   * - %user%
   *
   * @param User user
   * @return string
   */
  getWelcomeBackMessage(user) {
    let value = this.getContent('welcomeBackMessage')
    return value.replace(/\%user\%/, user.getUsername())
  }

  getNewFollowerMessage(user) {
    let value = this.getContent('newFollowerMessage')
    return value.replace(/\%user\%/, user.getUsername())
  }

  /**
   * Creates a User instance from the given username.
   * Loads stored data if found.
   *
   * @param string username
   * @return User
   */
  createUser(username) {
    // retrieve stored view or create new one
    let data = this.userStore.get(username) || { username, views: 0, status: 'available' }
    return new User(data.username, data.views, data.status)
  }

  /**
   * Saves the User instance
   *
   * @param User user
   */
  saveUser(user) {
    // saves to store
    this.userStore.set(user.getUsername(), user)
    // updates collection
    this.users.replaceByUsername(user.getUsername(), user)
  }

}
