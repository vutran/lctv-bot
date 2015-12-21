'use strict'

export default function(cmd, args) {

  if (args[0].length) {
    switch(args[0]) {
      case 'githubLink':
        this.client.say('Displays the link to the bot\'s GitHub project.')
        break;
      case 'project':
        this.client.say('Display the current project information.')
        break;
      case 'status':
        this.client.say('Set your status to "away", or "available" to enable the automatic Bot replies when someone mentions you when you are away.')
        break;
      case 'views':
        this.client.say('This will display how many times you have logged in to view the channel/stream.')
        break;
    }
  } else {
    this.client.say('Commands available: !githubLink, !project, !status, !views')
  }

}
