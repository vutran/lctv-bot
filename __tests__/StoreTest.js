'use strict'

import './DontMock'
import Store from '../src/Store'

describe('Store', () => {

  let store = null

  beforeEach(() => {
    store = new Store({
      dir: 'test-store'
    })
  })

  it('should create a new Store instance', () => {
    expect(store).toEqual(jasmine.any(Store))
  })

  it('should set a value', () => {
    store.set('foo', 'bar')
    expect(store.get('foo')).toBe('bar')
  })

})
