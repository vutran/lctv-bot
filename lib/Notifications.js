import notifier from 'node-notifier'

export default class Notifications {

  /**
   * Displays the notification
   *
   * @param string title
   * @param string message
   */
  static show(title, message) {
    notifier.notify({ title, message })
  }

}
