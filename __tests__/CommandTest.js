'use strict'

import './DontMock'
import Command from '../src/Command'

describe('Command', () => {

  const handler = () => { }
  let cmd = null

  beforeEach(() => {
    cmd = new Command('name', 'desc', handler)
    // spyOn(handler).andCallThrough()
  })

  it('should create a new command', () => {
    expect(cmd).toEqual(jasmine.any(Command))
    expect(cmd.getName()).toBe('name')
    expect(cmd.getDescription()).toBe('desc')
    // expect(cmd.getHandler).toBe(jasmine.any(Function))
  })

  // FIXME
  // it('should execute the handler', () => {
  //   cmd.exec()
  //   expect(handler).toHaveBeenCalled()
  // })

})
