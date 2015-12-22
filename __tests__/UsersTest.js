'use strict'

import './DontMock'
import User from '../src/User'
import Users from '../src/Users'

describe('Users', () => {

  let usersList = null
  const user_0 = new User('user_0')
  const user_1 = new User('user_1')
  const user_2 = new User('user_2')

  beforeEach( () => {
    // create a new Users instance
    usersList = new Users()
    usersList.add(user_0)
    usersList.add(user_1)
    usersList.add(user_2)
    return usersList
  })

  it('should add a new user', () => {
    // create a new user
    const user = new User('vutran')
    usersList.add(user)
    expect(usersList.count()).toBe(4)
    expect(usersList.exists('vutran')).toBeTruthy()
  })

  it('should remove a user by a username', () => {
    usersList.removeByUsername('user_0')
    expect(usersList.exists('user_0')).toBeFalsy()
    expect(usersList.count()).toBe(2)
  })

  it('should replace a user by a username', () => {
    const newUser = new User('user_100')
    usersList.replaceByUsername('user_0', newUser)
    expect(usersList.exists('user_0')).toBeFalsy()
    expect(usersList.exists('user_100')).toBeTruthy()
  })

  it('should get the index by a username', () => {
    expect(usersList.getIndexByUsername('user_0')).toBe(0)
    expect(usersList.getIndexByUsername('user_1')).toBe(1)
    expect(usersList.getIndexByUsername('user_2')).toBe(2)
  })

  it('should get all users'), () => {
    expect(usersList.getAll()).toEqual([user_0, user_1, user_2])
  }

  it('should retrieve the count of the users'), () => {
    expect(usersList.count()).toBe(3)
  }

  it('should check if the user exists by a given username', () => {
    expect(usersList.exists('user_0')).toBeTruthy()
    expect(usersList.exists('user_100')).toBeFalsy()
  })

})
