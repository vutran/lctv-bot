'use strict'

import EventEmitter from 'events'

export default class Timer extends EventEmitter {

  constructor(tickDelay = 1000) {
    super(tickDelay)
    this.ticks = 0
    this.tickDelay = tickDelay
  }

  getDelay() {
    return this.tickDelay
  }

  getTicks() {
    return this.ticks
  }

  tick() {
    this.ticks++
    this.emit('tick', this.ticks)
  }

  start() {
    setInterval(this.tick.bind(this), this.tickDelay)
  }

}
