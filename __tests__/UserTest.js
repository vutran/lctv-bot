'use strict'

import './DontMock'
import User from '../src/User'

describe('User', () => {

  const user = new User('vutran', 100, 'away')

  it('should be an instance of User', () => {
    expect(user).toEqual(jasmine.any(User))
  })

  it('should get the username', () => {
    expect(user.getUsername()).toBe('vutran')
  })

  it('should get the @mention', () => {
    expect(user.getMention()).toBe('@vutran')
  })

  it('should get the view count', () => {
    expect(user.getViews()).toBe(100)
  })

  it('should set the view count', () => {
    user.setViews(150)
    expect(user.getViews()).toBe(150)
  })

  it('should increment the view count', () => {
    user.setViews(200)
    user.view()
    expect(user.getViews()).toBe(201)
  })

  it('should get the status', () => {
    expect(user.getStatus()).toBe('away')
  })

  it('should set a new status', () => {
    user.setStatus('fake_status')
    expect(user.getStatus()).toBe('fake_status')
  })

  it('should set the status to away', () => {
    user.setAway('away')
    expect(user.getStatus()).toBe('away')
    expect(user.isAway()).toBeTruthy()
    expect(user.isAvailable()).toBeFalsy()
  })

  it('should set the status to available', () => {
    user.setAvailable('available')
    expect(user.getStatus()).toBe('available')
    expect(user.isAway()).toBeFalsy()
    expect(user.isAvailable()).toBeTruthy()
  })

})
