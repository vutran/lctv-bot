'use strict'

import '../DontMock'
import Client from '../../src/Client'
import Bot from '../../src/Bot'
import Store from '../../src/Store'
import User from '../../src/User'
import Command from '../../src/Command'

describe('Bot', () => {

  let bot = null

  beforeEach(() => {
    // FIXME: generate mock Client, Bot
    bot = new Bot({
      client: new Client()
    })
  })

  it('should create a new Bot instance', () => {
    expect(bot).toEqual(jasmine.any(Bot))
  })

  it('should set the bot name', () => {
    bot.setContent('botName', 'Test Bot')
    expect(bot.getName()).toBe('Test Bot')
  })

  it('should set the channel', () => {
    bot.setChannel('Test Channel')
    expect(bot.getChannel()).toBe('Test Channel')
  })

  it('should set the mentions', () => {
    bot.setMentions('Test Mentions')
    expect(bot.getMentions()).toBe('Test Mentions')
  })

  it('should set the admins', () => {
    bot.setAdmins('Test Admins')
    expect(bot.getAdmins()).toBe('Test Admins')
  })

  it('should set a content key/value', () => {
    bot.setContent('foo', 'bar')
    expect(bot.getContent('foo')).toBe('bar')
  })

  it('should add a plugin', () => {
    const TEST_PLUGIN = {}
    bot.addPlugin(TEST_PLUGIN)
    expect(bot.plugins.length).toBe(1)
  })

  it('should create a Store', () => {
    expect(bot.createStore('test-store')).toEqual(jasmine.any(Store))
  })

  it('should retrieve a User', () => {
    // FIXME: fix with new callback
    expect(bot.retrieveUser('test-username')).toEqual(jasmine.any(User))
  })

  it('should create a Command', () => {
    bot.createCommand('test-cmd', 'test cmd desc', () => {})
    expect(bot.getCommands()).toEqual([jasmine.any(Command)])
  })

  it('should create an admin Command', () => {
    bot.createAdminCommand('test-cmd', 'test cmd desc', () => {})
    expect(bot.getAdminCommands()).toEqual([jasmine.any(Command)])
  })

  it('should retrieve the first mention from a string', () => {
    expect(bot.getMentionsFromValue('test @vutran')).toEqual(['@vutran'])
  })

})
