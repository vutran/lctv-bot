import storage from 'node-persist'
import hash from 'object-hash'
import Client from './lib/Client'
import Stanza from './lib/Stanza'

// Load env. vars
require('dotenv').load()

// Initialize the persistent store
storage.initSync()

// Create a new client
let client = new Client({
  username: process.env.LCTV_USERNAME,
  password: process.env.LCTV_PASSWORD
})

// Connect to the chat server
client.connect()

client.on('lctv:message', function(stanza) {
  // retrieve the user and strip the room
  let user = stanza.getAttr('from').replace(client.getRoom() + '/', '')
  // retrieve the message body
  let body = stanza.getChildText('body')
  // if the message is not yet delivered
  if (stanza.getChild('delay') === undefined) {
    console.log(user + ': ' + body)
  }
})
