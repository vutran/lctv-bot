'use strict'

import { EventEmitter } from 'events'
import util from 'util'

export default class Timer {

  constructor(tickDelay = 1000) {
    this.ticks = 0
    this.tickDelay = tickDelay

    EventEmitter.call(this)
  }

  tick() {
    this.ticks++
    this.emit('lctv:timer:tick', this.ticks)
  }

  start() {
    setInterval(this.tick.bind(this), this.tickDelay)
  }

}

util.inherits(Timer, EventEmitter)
