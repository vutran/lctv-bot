import moment from 'moment'
import Client from './Client'
import Users from './Users'
import User from './User'
import Followers from './Followers'
import Store from './Store'
import Utils from './Utils'
import Voice from './Voice'
import Notifications from './Notifications'

// import commands
import { githubLink, help, project, views } from './commands'
import { echo, setContent, start, say } from './commands/admin'

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

    // create new storage device
    this.store = new Store({
      dir: 'general'
    })
    this.userStore = new Store({
      dir: 'user'
    })

    // create a the Followers and listen for new followers
    this.followers = new Followers(this.getFollowersUrl())
    this.followers.on('lctv:new-follower', this.handleNewFollower.bind(this))

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
    this.client.on('online', this.handleOnline.bind(this))
    this.client.on('lctv:cmd', this.handleCommands.bind(this))
    this.client.on('lctv:cmd:admin', this.handleAdminCommands.bind(this))
    this.client.on('lctv:presence', this.handleInitialPresence.bind(this))
    this.client.on('lctv:presence', this.handleUnavailablePresence.bind(this))
    this.client.on('lctv:mentions', this.handleMentions.bind(this))

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
      this.client.on('lctv:presence', this.handleNewPresence.bind(this))
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
    let data = this.userStore.get(username) || { username, views: 0 }
    return new User(data.username, data.views)
  }

  /**
   * Saves the User instance
   *
   * @param User user
   */
  saveUser(user) {
    this.userStore.set(user.getUsername(), user)
  }

  handleOnline(data) {
    // Joins the given channel
    this.join(this.getChannel())
  }

  /**
   * Handles the public commands.
   *
   * @param string cmd
   * @param array args
   * @param Stanza stanza
   */
  handleCommands(cmd, args, stanza) {
    switch(cmd) {
      case 'help':
        help.bind(this, cmd, args, stanza)()
        break;
      case 'githubLink':
        githubLink.bind(this, cmd, args, stanza)()
        break;
      case 'project':
        project.bind(this, cmd, args, stanza)()
        break;
      case 'views':
        views.bind(this, cmd, args, stanza)()
        break;
    }
  }

  /**
   * Handles the admin commands.
   *
   * @param string cmd
   * @param array args
   * @param Stanza stanza
   */
  handleAdminCommands(cmd, args, stanza) {
    switch(cmd) {
      case 'start':
        start.bind(this, cmd, args, stanza)()
        break;
      case 'echo':
        echo.bind(this, cmd, args, stanza)()
        break;
      case 'setContent':
        setContent.bind(this, cmd, args, stanza)()
        break;
      case 'say':
        say.bind(this, cmd, args, stanza)()
    }
  }

  /**
   * Handles the initial presence.
   * Adds the initial users to the users list.
   *
   * @param Stanza stanza
   */
  handleInitialPresence(stanza) {
    // retrieve the username
    let username = Utils.getUsername(stanza.getAttr('from'))
    let user = this.createUser(username)
    // if not yet in the users list
    if (!this.users.exists(user)) {
      // add user to the users list
      this.users.add(user)
    }
  }

  /**
   * Handles the unavailable presense (when a user leaves).
   * Removes the user from the users list
   *
   * @param Stanza stanza
   */
  handleUnavailablePresence(stanza) {
    // retrieve the username
    let username = Utils.getUsername(stanza.getAttr('from'))
    let user = this.createUser(username)
    if (stanza.getAttr('type') === "unavailable") {
      // if in the users list
      if (this.users.exists(user)) {
        // remove user from the users list
        this.users.remove(user)
      }
    }
  }

  /**
   * Handles the new presence.
   * Displays the welcome messages to new users.
   * Adds the user to the users list.
   *
   * @param Stanza stanza
   */
  handleNewPresence(stanza) {
    if (stanza.getAttr('type') !== "unavailable") {
      // retrieve the username
      let username = Utils.getUsername(stanza.getAttr('from'))
      let user = this.createUser(username)
      // if not own user
      if (user.getUsername() !== this.client.getUsername()) {
        if (user.getViews() > 0) {
          // display in channel
          this.client.say(this.getWelcomeBackMessage(user))
          Voice.say(this.getWelcomeBackMessage(user))
        } else {
          // display in channel
          this.client.say(this.getWelcomeMessage(user))
          Voice.say(this.getWelcomeMessage(user))
        }
        // desktop notification
        let message = user.getUsername() + ' just joined the channel.'
        Notifications.show(this.getContent('botName'), message)
        // if not yet in the users list
        if (!this.users.exists(user)) {
          // add user to the users list
          this.users.add(user)
        }
        // increment user view
        user.view()
        // save user data
        this.saveUser(user)
      }
    }
  }

  /**
   * Handles mentions.
   * Display notifications.
   *
   * @param string username
   * @param Stanza stanza
   */
  handleMentions(username, stanza) {
    let body = stanza.getChildText('body')
    let message = username + ' mentioned you: ' + body
    Notifications.show(this.getContent('botName'), message)
  }

  /**
   * Handles new follower events
   *
   * @param string username
   */
  handleNewFollower(username) {
    let user = this.createUser(username)
    let message = user.getUsername() + ' just followed you.'
    this.client.say(this.getNewFollowerMessage(user))
    Notifications.show(this.getContent('botName'), message)
    Voice.say(this.getNewFollowerMessage(user))
  }

}
