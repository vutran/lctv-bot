'use strict'

import './DontMock'
import User from '../src/User'

describe('User', () => {

  const user = new User({
    username: 'vutran',
    role: 'participant'
  })

  it('should be an instance of User', () => {
    expect(user).toEqual(jasmine.any(User))
  })

  it('should get the username', () => {
    expect(user.getUsername()).toBe('vutran')
  })

  it('should get the @mention', () => {
    expect(user.getMention()).toBe('@vutran')
  })

  it('should set the role to moderator', () => {
    user.setRole('moderator')
    expect(user.getRole()).toBe('moderator')
  })

  it('should set the role to participant', () => {
    user.setRole('participant')
    expect(user.getRole()).toBe('participant')
  })

})
