import User from '../lib/User'

describe('User', () => {

  let user = new User('vutran', 100, 'away')

  it('retrieves the uesrname', () => {
    expect(user.getUsername()).toBe('vutran')
  })

})
