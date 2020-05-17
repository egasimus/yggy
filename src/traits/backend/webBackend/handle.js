module.exports = WebPageHandle (url) {
  return {
    get path () {
      return url
    },
    exists   () {
      // verify the page doesn't return a 404 (OPTIONS request?)
    },
    stat     () {
      // get info about the page (OPTIONS requires again?)
    },
    remove   () {
      // remove this page from the cache
    },
    read     () {
      // get either the raw contents or a processed version
    },
    write    () {
      // make this the only saved version of the page
    },
    append   () {
      // add versioned snapshot
    },
    watch    () {
      // periodically poll page for changes
    },
  }
}
