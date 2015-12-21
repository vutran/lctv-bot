export function handleError(error) {
  this.emit('lctv:follower:error', error)
  console.error(error)
}

export function handleNewArticle(item) {
  this.emit('lctv:follower:new', item)
}

export function handleRun(error, articles) {
  this.emit('lctv:follower:run', error, articles)
  if (error) {
    console.error(error)
  }
  if (articles && articles.length) {
    // set changed flag
    let changed = false
    // iterate through all
    articles.forEach((item, key) => {
      // if not yet in the list
      if (!this.exists(item.title)) {
        // add to users list
        this.add(item.title)
        changed = true
      }
    })
    if (changed) {
      // save to store
      this.save()
    }
  }
}
