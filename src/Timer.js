'use strict'

import EventEmitter from 'events'
import util from 'util'

export default class Timer extends EventEmitter {

  constructor(tickDelay = 1000) {
    super(tickDelay)
    this.ticks = 0
    this.tickDelay = tickDelay
  }

  tick() {
    this.ticks++
    this.emit('lctv:timer:tick', this.ticks)
  }

  start() {
    setInterval(this.tick.bind(this), this.tickDelay)
  }

}
