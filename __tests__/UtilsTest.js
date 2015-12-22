'use strict'

import './DontMock'
import Utils from '../src/Utils'

describe('Utils', () => {

  it('should get the username from the JID resource', () => {
    const value = 'vutran@chat.livecoding.tv/vutran'
    expect(Utils.getUsername(value)).toBe('vutran')
  })

  it('should get the commands', () => {
    expect(Utils.getCommands('!some-cmd')).toContain('!some-cmd')
    expect(Utils.getCommands('!someCmd')).toContain('!someCmd')
    expect(Utils.getCommands('!someCmd arg1 arg2')).toContain('!someCmd')
    expect(Utils.getCommands('!cmd123 arg1 arg2')).toContain('!cmd123')
    expect(Utils.getCommands('no commands')).toEqual([])
  })

  it('should get the command', () => {
    expect(Utils.getCommand('!some-cmd')).toBe('some-cmd')
    expect(Utils.getCommand('no commands')).toBe('')
  })

  it('should get a list of mentions', () => {
    expect(Utils.getMentions('@vutran @tranvu no mention')).toContain('@vutran')
    expect(Utils.getMentions('no mentions')).toEqual([])
  })

  it('should check if mentions are available', () => {
    expect(Utils.hasMentions('@vutran', '@vutran')).toBeTruthy()
    expect(Utils.hasMentions('@vutran', 'someother')).toBeFalsy()
    expect(Utils.hasMentions('@vutran')).toBeTruthy()
    expect(Utils.hasMentions('no mentions')).toBeFalsy()
  })

})
