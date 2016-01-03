export default class Question {

  constructor(data) {
    this.data = data
  }

  get id() {
    return this.data.id
  }

  get question() {
    return this.data.question
  }

  get answer() {
    return this.data.answer
  }

}
