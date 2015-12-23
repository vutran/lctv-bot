'use strict'

import path from 'path'
import YoutubeMp3Downloader from 'youtube-mp3-downloader'
import Player from 'player'
import Song from './Song'

/**
 * Adds an audio player/playlist that plays from YouTube.
 * Automatically downloads mp3s from YouTube before getting added to queue.
 *
 * Commands:
 * - request
 * - playlist, queue
 * - skipSong, skip
 * - currentSong, playing
 */
export default function(bot) {

  const REQUEST_DELAY = 15
  let CAN_REQUEST = true

  // current song
  let currentSong = null

  // create a store
  const audioStore = bot.createStore('audio-store')

  // create the player
  const player = new Player()

  // create the downloader instance
  const YD = new YoutubeMp3Downloader({
    ffmpegPath: "/usr/local/bin/ffmpeg",
    outputPath: path.join(process.env.PWD, '__audio__'),
    youtubeVideoQuality: "highest",
    queueParallelism: 2,
    progressTimeout: 2000
  })

  player.on('error', console.error)

  player.on('playing', (song) => {
    currentSong = song
    current()
  })

  player.on('playend', () => {
    currentSong = null
  })

  YD.on('error', console.error)

  YD.on('finished', (data) => {
    // create a new song
    let song = new Song(data.videoId, data.videoTitle, data.file)
    // handles the new song
    handleSong(song)
  })

  /**
   * @param Song song
   */
  const handleSong = (song) => {
    // save data to store
    audioStore.set(song.getId(), song)
    // add to player
    player.add(song)
    bot.say(song.getName() + ' has been added to the queue.')
    // if not currently playing anything
    if (!currentSong) {
      // starts the player
      player.play()
    }
  }

  /**
   * Queues a song
   */
  const queue = (vId) => {
    // retrieve from store
    const data = audioStore.get(vId)
    if (!data) {
      const fileName = vId + '.mp3'
      YD.download(vId, fileName)
    } else {
      // create a Song instance
      const song = new Song(data.id, data.name, data.file)
      handleSong(song)
    }
  }

  const current = () => {
    if (currentSong) {
      bot.say('Currently playing: ' + currentSong.getName())
    } else {
      bot.say('There are no songs currently being played. Request one now with !request <youtubeId>')
    }
  }

  const skip = () => {
    bot.say('Playing next song...')
    player.next()
  }

  const list = () => {
    let upcoming = []
    // FIXME: this is not cool...
    player._list.forEach((item, key) => {
      if (key < 5) {
        upcoming.push(item.getName())
      }
    })
    bot.say('Current queue: ' + upcoming.join(', '))
  }

  bot.createAdminCommand(['skipSong', 'skip'], 'Skips the current song', () => {
    skip()
  })

  bot.createCommand('request', 'Requests a new song to be played', (cmd, args) => {
    if (CAN_REQUEST) {
      CAN_REQUEST = false
      const vId = args.join(' ')
      queue(vId)
    } else {
      bot.say('Cannot request a song right now. Please wait a while before trying again.')
    }
  })

  bot.createCommand(['currentSong', 'playing'], 'Skips the current song', () => {
    current()
  })

  bot.createCommand(['playlist', 'queue'], 'Skips the current song', () => {
    list()
  })

  bot.on('lctv:timer:tick', (ticks) => {
    if (ticks % REQUEST_DELAY === 0) {
      CAN_REQUEST = true
    }
  })

}
