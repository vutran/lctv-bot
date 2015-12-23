'use strict'

import './DontMock'
import Timer from '../src/Timer'

describe('Timer', () => {

  let timer = null

  beforeEach(() => {
    // create a new timer
    timer = new Timer(5000)
  })

  it('should create a new Timer instance', () => {
    expect(timer).toEqual(jasmine.any(Timer))
  })

  it('should retrieve the delay', () => {
    expect(timer.getDelay()).toBe(5000)
  })

  it('should have 0 ticks', () => {
    expect(timer.getTicks()).toBe(0)
  })

  it('should increment the ticks', () => {
    timer.tick()
    expect(timer.getTicks()).toBe(1)
  })

})
