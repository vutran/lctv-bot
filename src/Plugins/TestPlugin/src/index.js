'use strict'

export default class TestPlugin {

  constructor(config) {
    this.config = Object.assign({}, config)
  }

  print() {
    console.log(this.config.foo, this.config.bar)
  }

}
