import './UserTestDontMock'
import User from '../lib/User'

describe('User', () => {

  let user = new User('vutran', 100, 'away')

  it('retrieves the username', () => {
    expect(user.getUsername()).toBe('vutran')
  })

  it('retrieves the @mention', () => {
    expect(user.getMention()).toBe('@vutran')
  })

  it('retrieves the view count', () => {
    expect(user.getViews()).toBe(100)
  })

  it('sets the view count', () => {
    user.setViews(150)
    expect(user.getViews()).toBe(150)
  })

  it('increments the view count', () => {
    user.setViews(200)
    user.view()
    expect(user.getViews()).toBe(201)
  })

  it('retrieves the status', () => {
    expect(user.getStatus()).toBe('away')
  })

  it('sets a new status', () => {
    user.setStatus('fake_status')
    expect(user.getStatus()).toBe('fake_status')
  })

  it('sets the status to away', () => {
    user.setAway('away')
    expect(user.getStatus()).toBe('away')
    expect(user.isAway()).toBe(true)
    expect(user.isAvailable()).toBe(false)
  })

  it('sets the status to available', () => {
    user.setAvailable('available')
    expect(user.getStatus()).toBe('available')
    expect(user.isAway()).toBe(false)
    expect(user.isAvailable()).toBe(true)
  })

})
