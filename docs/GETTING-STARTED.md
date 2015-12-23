# Installation

```
git clone git@github.com:vutran/lctv-bot.git

cd lctv-bot

```

# Configurations

Create a `.env` file

```
NODE_ENV=development
LCTV_USERNAME=this_is_your_username
LCTV_PASSWORD=this_is_your_password
LCTV_CHANNEL=this_is_the_channel_name_you_want_to_join
LCTV_MENTIONS=a_keyword_you_want_to_listen_to_for_notifications
LCTV_ADMINS=this_is_the_admin_username
LCTV_FOLLOWERS_URL=this_is_the_url_to_your_followers_rss_feed
```

# Running the Bot

```
npm install && npm start
```

# Starting the Bot

Once the script has been started (via `npm start`), you'll need to start the bot in the chat room so it can begin listening to Jabber events.

Type `!start` in chat room.
