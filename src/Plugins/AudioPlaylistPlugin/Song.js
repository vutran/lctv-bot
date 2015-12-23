'use strict'

export default class Song {

  constructor(id, name, file) {
    this.id = id
    this.name = name
    this.file = file
  }

  get src() {
    return this.getFile()
  }

  getId() {
    return this.id
  }

  getName() {
    return this.name
  }

  getFile() {
    return this.file
  }

}
