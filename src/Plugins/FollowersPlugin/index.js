'use strict'

import FollowersPlugin from './src'

export default function(bot) {

  // retrieve the followers URL
  const LCTV_FOLLOWERS_URL = process.env.LCTV_FOLLOWERS_URL

  // initialize the plugin
  new FollowersPlugin({
    // pass the Bot
    bot,
    // normal configs
    url: LCTV_FOLLOWERS_URL,
    newFollowerMessage: 'Thank you for following me, %user%.'
  })

}
