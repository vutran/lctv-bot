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

client.on('stanza', function(data) {
  // retrieve the user and strip the room
  let user = data.getAttr('from').replace(client.getRoom() + '/', '')
  if (data.is('message')) {
    // get the message ID
    let messageId = data.getAttr('id')
    // retrieve stored messages
    let messages = storage.getItemSync('messages') || {}
    // if the message not yet stored
    if (!messages[messageId]) {
      // create a new Stanza
      let stanza = new Stanza(data)
      let body = data.getChildText('body')
      // log to console
      console.log(user + ': ' + body)
      // store the message Stanza
      messages[messageId] = stanza
      storage.setItemSync('messages', messages)
    }
  } else {
    // client.say('Welcome ' + user + ' to the stream.')
    console.log(data)
  }

  // // if it's a presence
  // if (data.is('presence')) {
  //   // retrieve the previously stored presence
  //   let presence = storage.getItemSync('presence') || {}
  //   // hash the object
  //   let stanzaHash = hash(data)
  //   // retrieve the previous stanza if available
  //   let prevStanza = presence[stanzaHash]
  //   // create a new Stanza
  //   let stanza = new Stanza(data)
  //   // if the previous stanza is found
  //   if (prevStanza && prevStanza.time <= client.getStartTime()) {
  //     console.log('skipping: ' + stanzaHash)
  //   } else {
  //     // retrieve the user and strip the room
  //     let user = data.getAttr('from').replace(client.getRoom() + '/', '')
  //     // client.say('Welcome ' + from + ' to the stream.')
  //     console.log('Welcome ' + user + ' to the stream.')
  //     // append to presence
  //     presence[stanzaHash] = stanza.time + ': ' + 'Welcome ' + user + ' to the stream.'
  //     // save to the store
  //     storage.setItemSync('presence', presence)
  //   }
  // }
})
